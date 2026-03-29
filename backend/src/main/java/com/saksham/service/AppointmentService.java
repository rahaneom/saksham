package com.saksham.service;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.Objects;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.saksham.dto.BookingResponse;
import com.saksham.dto.CounsellorAppointmentResponse;
import com.saksham.dto.SlotDisplayResponse;
import com.saksham.dto.SlotResponse;
import com.saksham.dto.StudentAppointmentResponse;
import com.saksham.entity.Appointment;
import com.saksham.entity.AppointmentStatus;
import com.saksham.entity.Role;
import com.saksham.entity.Slot;
import com.saksham.entity.User;
import com.saksham.repository.AppointmentRepository;
import com.saksham.repository.SlotRepository;
import com.saksham.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentService {

        private final AppointmentRepository appointmentRepository;
        private final SlotRepository slotRepository;
        private final UserRepository userRepository;

        private List<LocalDate> getAllowedBookingDates() {

                LocalDate today = LocalDate.now();
                DayOfWeek todayDay = today.getDayOfWeek();

                switch (todayDay) {
                        case FRIDAY:
                                return List.of(today, today.plusDays(3)); // Fri + Mon

                        case SATURDAY:
                                return List.of(today.plusDays(2)); // Monday

                        case SUNDAY:
                                return List.of(today.plusDays(1)); // Monday

                        default:
                                return List.of(today, today.plusDays(1)); // normal
                }
        }

        // Book Appointment
        @Transactional
        public Appointment bookAppointment(UUID studentId, UUID slotId) {

                // 1. Fetch student
                User student = userRepository.findById(studentId)
                                .orElseThrow(() -> new RuntimeException("Student not found"));

                if (student.getRole() != Role.ROLE_STUDENT) {
                        throw new RuntimeException("Only students can book appointments");
                }

                // 2. Fetch slot (WITH LOCK)
                Slot slot = slotRepository.findByIdForUpdate(slotId)
                                .orElseThrow(() -> new RuntimeException("Slot not found"));

                LocalDate slotDate = slot.getSlotDate();

                // 3. NO SUNDAY
                if (slotDate.getDayOfWeek() == DayOfWeek.SUNDAY) {
                        throw new RuntimeException("Booking not allowed on Sundays");
                }

                // 4. ALLOWED DATES
                List<LocalDate> allowedDates = getAllowedBookingDates();

                if (!allowedDates.contains(slotDate)) {
                        throw new RuntimeException("Booking allowed only for next working slots");
                }

                // 5. 1-hour cutoff
                LocalDateTime slotStart = LocalDateTime.of(slotDate, slot.getStartTime());

                if (LocalDateTime.now().isAfter(slotStart.minusHours(1))) {
                        throw new RuntimeException("Booking not allowed within 1 hour of slot");
                }

                // 6. IMPORTANT: ONE BOOKING PER DAY PER STUDENT
                boolean alreadyBooked = appointmentRepository
                                .existsByStudent_IdAndSlot_SlotDateAndStatus(
                                                studentId,
                                                slotDate,
                                                AppointmentStatus.BOOKED);

                if (alreadyBooked) {
                        throw new RuntimeException("You already have a booking for this day");
                }

                // 7. SLOT MUST BE FREE
                if (!slot.isAvailable()) {
                        throw new RuntimeException("Slot already booked");
                }

                // 8. Mark slot unavailable
                slot.setAvailable(false);
                slotRepository.save(slot);

                // 9. Create appointment
                Appointment appointment = Appointment.builder()
                                .student(student)
                                .slot(slot)
                                .status(AppointmentStatus.BOOKED)
                                .build();

                return appointmentRepository.save(appointment);
        }

        // Booking response
        @Transactional
        public BookingResponse bookAppointmentResponse(UUID studentId, UUID slotId) {

                Appointment appointment = bookAppointment(studentId, slotId);

                return new BookingResponse(
                                appointment.getId(),
                                appointment.getSlot().getSlotDate(),
                                appointment.getSlot().getStartTime(),
                                appointment.getSlot().getEndTime(),
                                appointment.getStatus().toString());
        }

        // Student Dashboard
        public List<StudentAppointmentResponse> getAppointmentsForStudent(UUID studentId) {

                return appointmentRepository.findByStudent_Id(studentId)
                                .stream()
                                .sorted((a, b) -> {

                                        int dateCompare = b.getSlot().getSlotDate()
                                                        .compareTo(a.getSlot().getSlotDate());

                                        if (dateCompare != 0)
                                                return dateCompare;

                                        return b.getSlot().getStartTime()
                                                        .compareTo(a.getSlot().getStartTime());
                                })
                                .map(a -> new StudentAppointmentResponse(
                                                a.getId(),
                                                a.getSlot().getSlotDate(),
                                                a.getSlot().getStartTime(),
                                                a.getSlot().getEndTime(),
                                                a.getStatus().toString()))
                                .toList();
        }

        // Counsellor Dashboard
        public Page<CounsellorAppointmentResponse> getAppointmentsForCounsellor(
                        UUID counsellorId,
                        AppointmentStatus status,
                        Pageable pageable) {

                User counsellor = userRepository.findById(counsellorId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (counsellor.getRole() != Role.ROLE_COUNSELLOR) {
                        throw new RuntimeException("Only counsellor can view appointments");
                }

                Page<Appointment> appointmentPage;

                if (status != null) {
                        appointmentPage = appointmentRepository.findByStatusIn(
                                        List.of(status),
                                        pageable);
                } else {
                        appointmentPage = appointmentRepository.findByStatusIn(
                                        List.of(AppointmentStatus.BOOKED, AppointmentStatus.COMPLETED),
                                        pageable);
                }

                return appointmentPage.map(a -> new CounsellorAppointmentResponse(
                                a.getId(),
                                a.getStudent().getName(),
                                a.getStudent().getAcademicYear(),
                                a.getStudent().getPhone(),
                                a.getSlot().getSlotDate(),
                                a.getSlot().getStartTime(),
                                a.getSlot().getEndTime(),
                                a.getStatus().toString()));
        }

        // Cancel Appointment
        @Transactional
        public void cancelAppointment(UUID appointmentId, UUID studentId) {

                // 1. Validate student
                User student = userRepository.findById(studentId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (student.getRole() != Role.ROLE_STUDENT) {
                        throw new RuntimeException("Only students can cancel appointments");
                }

                // 2. Fetch appointment
                Appointment appointment = appointmentRepository.findById(appointmentId)
                                .orElseThrow(() -> new RuntimeException("Appointment not found"));

                // 3. Ownership check
                if (!appointment.getStudent().getId().equals(studentId)) {
                        throw new RuntimeException("Unauthorized cancellation");
                }

                // 4. Status checks
                if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
                        throw new RuntimeException("Completed appointment cannot be cancelled");
                }

                if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
                        return; // idempotent (safe repeat call)
                }

                // 5. Cancel appointment
                appointment.setStatus(AppointmentStatus.CANCELLED);

                // 6. Free slot (only if needed)
                Slot slot = appointment.getSlot();
                if (!slot.isAvailable()) {
                        slot.setAvailable(true);
                        slotRepository.save(slot);
                }

                appointmentRepository.save(appointment);
        }

        // Mark Appointment Completed
        @Transactional
        public void markAppointmentCompleted(UUID appointmentId, UUID counsellorId) {

                // 1. Validate counsellor
                User counsellor = userRepository.findById(counsellorId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (counsellor.getRole() != Role.ROLE_COUNSELLOR) {
                        throw new RuntimeException("Only counsellor can complete appointment");
                }

                // 2. Fetch appointment
                Appointment appointment = appointmentRepository.findById(appointmentId)
                                .orElseThrow(() -> new RuntimeException("Appointment not found"));

                // 3. Status check
                if (appointment.getStatus() != AppointmentStatus.BOOKED) {
                        throw new RuntimeException("Only booked appointments can be completed");
                }

                // 4. ⏱ Time validation (VERY IMPORTANT)
                LocalDateTime slotEnd = LocalDateTime.of(
                                appointment.getSlot().getSlotDate(),
                                appointment.getSlot().getEndTime());

                if (LocalDateTime.now().isBefore(slotEnd)) {
                        throw new RuntimeException("Cannot complete appointment before it ends");
                }

                // 5. Mark completed
                appointment.setStatus(AppointmentStatus.COMPLETED);

                appointmentRepository.save(appointment);
        }

        public Map<String, List<SlotDisplayResponse>> getBookingSlotsForStudent() {

                LocalDateTime now = LocalDateTime.now();

                Map<String, List<SlotDisplayResponse>> response = new LinkedHashMap<>();

                // ALWAYS FETCH NEXT 2 VALID WORKING DAYS
                List<LocalDate> datesToCheck = List.of(
                                LocalDate.now(),
                                LocalDate.now().plusDays(1),
                                LocalDate.now().plusDays(2),
                                LocalDate.now().plusDays(3));

                for (LocalDate date : datesToCheck) {

                        // SKIP WEEKENDS
                        if (date.getDayOfWeek() == DayOfWeek.SUNDAY ||
                                        date.getDayOfWeek() == DayOfWeek.SATURDAY) {
                                continue;
                        }

                        List<SlotDisplayResponse> slots = slotRepository.findBySlotDate(date)
                                        .stream()
                                        .sorted(Comparator.comparing(Slot::getStartTime))
                                        .map(slot -> {

                                                LocalDateTime slotStart = LocalDateTime.of(date, slot.getStartTime());

                                                // Skip past slots completely
                                                if (now.isAfter(slotStart)) {
                                                        return null;
                                                }

                                                boolean bookable = slot.isAvailable()
                                                                && now.isBefore(slotStart.minusHours(1));

                                                return new SlotDisplayResponse(
                                                                slot.getId(),
                                                                slot.getSlotDate(),
                                                                slot.getStartTime(),
                                                                slot.getEndTime(),
                                                                bookable);
                                        })
                                        .filter(Objects::nonNull)
                                        .toList();

                        if (!slots.isEmpty()) {
                                response.put(date.toString(), slots);
                        }

                        // ONLY TAKE FIRST 2 VALID DAYS
                        if (response.size() == 2) {
                                break;
                        }
                }

                return response;
        }

        @Transactional
        public void bookViaCalendly(UUID studentId, LocalDateTime start, LocalDateTime end) {

                User student = userRepository.findById(studentId)
                                .orElseThrow(() -> new RuntimeException("Student not found"));

                LocalDate slotDate = start.toLocalDate();
                LocalTime startTime = start.toLocalTime();

                System.out.println("Start Time from Calendly: " + startTime);

                // Find slot
                Slot slot = slotRepository.findBySlotDate(slotDate)
                                .stream()
                                .filter(s -> s.getStartTime().getHour() == startTime.getHour()
                                                && s.getStartTime().getMinute() == startTime.getMinute())
                                .findFirst()
                                .orElseThrow(() -> new RuntimeException("Slot not found"));

                System.out.println("Slot found: " + slot.getId());

                // Prevent duplicate booking
                boolean exists = appointmentRepository.existsBySlot_Id(slot.getId());

                if (exists) {
                        System.out.println("Already exists, skipping");
                        return;
                }

                // Mark slot unavailable
                slot.setAvailable(false);
                slotRepository.save(slot);

                // Create appointment
                Appointment appointment = Appointment.builder()
                                .student(student)
                                .slot(slot)
                                .status(AppointmentStatus.BOOKED)
                                .build();

                appointmentRepository.save(appointment);

                System.out.println("Appointment saved in DB");
        }

        @Transactional
        public void syncFromCalendly(List<Map<String, Object>> events) {

                for (Map<String, Object> event : events) {

                        // Skip cancelled events
                        String status = (String) event.get("status");
                        if ("canceled".equalsIgnoreCase(status)) {
                                System.out.println("Skipping cancelled event");
                                continue;
                        }

                        String startStr = (String) event.get("start_time");
                        String endStr = (String) event.get("end_time");

                        if (startStr == null || endStr == null)
                                continue;

                        LocalDateTime start = Instant.parse(startStr)
                                        .atZone(ZoneId.of("Asia/Kolkata"))
                                        .toLocalDateTime();

                        LocalDateTime end = Instant.parse(endStr)
                                        .atZone(ZoneId.of("Asia/Kolkata"))
                                        .toLocalDateTime();

                        // TEMP fallback (until invitee API added)
                        User student = userRepository.findAll().stream().findFirst()
                                        .orElseThrow(() -> new RuntimeException("No users found"));

                        try {
                                bookViaCalendly(student.getId(), start, end);
                        } catch (Exception e) {
                                System.out.println("Skipping duplicate or invalid booking");
                        }
                }
        }
}