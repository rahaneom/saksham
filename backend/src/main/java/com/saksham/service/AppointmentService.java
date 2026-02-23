package com.saksham.service;

import com.saksham.dto.BookingResponse;
import com.saksham.dto.CounsellorAppointmentResponse;
import com.saksham.dto.StudentAppointmentResponse;
import com.saksham.entity.*;
import com.saksham.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final SlotRepository slotRepository;
    private final UserRepository userRepository;

    // 🔵 STEP 3: Book Appointment (TOMORROW ONLY)
    @Transactional
    public Appointment bookAppointment(UUID studentId, UUID slotId) {

        // 1️⃣ Fetch student
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (!student.getRole().equals(Role.ROLE_STUDENT)) {
            throw new RuntimeException("Only students can book appointments");
        }

        // 2️⃣ Fetch slot
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        // 🚫 Booking allowed only for tomorrow
        if (!slot.getSlotDate().equals(LocalDate.now().plusDays(1))) {
            throw new RuntimeException("Booking allowed only for tomorrow");
        }

        // 3️⃣ Check availability
        if (!slot.isAvailable()) {
            throw new RuntimeException("Slot already booked");
        }

        // 4️⃣ Lock slot
        slot.setAvailable(false);
        slotRepository.save(slot);

        // 5️⃣ Create appointment
        Appointment appointment = Appointment.builder()
                .student(student)
                .slot(slot)
                .status("BOOKED")
                .build();

        return appointmentRepository.save(appointment);
    }

    // 🔵 Student Dashboard: View Appointments
    public List<StudentAppointmentResponse> getAppointmentsForStudent(UUID studentId) {
        return appointmentRepository.findByStudent_Id(studentId)
                .stream()
                .map(a -> new StudentAppointmentResponse(
                        a.getSlot().getSlotDate(),
                        a.getSlot().getStartTime(),
                        a.getSlot().getEndTime(),
                        a.getStatus()
                ))
                .toList();
    }

    // 🔵 Counsellor Dashboard
    public List<CounsellorAppointmentResponse> getAllAppointmentsForCounsellor() {
        return appointmentRepository.findAll().stream()
                .map(a -> new CounsellorAppointmentResponse(
                        a.getStudent().getName(),
                        a.getStudent().getAcademicYear(),
                        a.getStudent().getPhone(),
                        a.getSlot().getSlotDate(),
                        a.getSlot().getStartTime(),
                        a.getSlot().getEndTime(),
                        a.getStatus()
                ))
                .toList();
    }

    // 🔵 STEP 2: Tomorrow Available Slots
    public List<Slot> getTomorrowAvailableSlots() {
        return slotRepository.findByIsAvailableTrueAndSlotDate(
                LocalDate.now().plusDays(1)
        );
    }

    // 🔵 STEP 4: Cancel Appointment (Student)
    @Transactional
    public void cancelAppointment(UUID appointmentId, UUID studentId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Only owner can cancel
        if (!appointment.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Unauthorized cancellation");
        }

        appointment.setStatus("CANCELLED");

        Slot slot = appointment.getSlot();
        slot.setAvailable(true);

        appointmentRepository.save(appointment);
        slotRepository.save(slot);
    }
    public BookingResponse bookAppointmentResponse(UUID studentId, UUID slotId) {

    Appointment appointment = bookAppointment(studentId, slotId);

    return new BookingResponse(
            appointment.getId(),
            appointment.getSlot().getSlotDate(),
            appointment.getSlot().getStartTime(),
            appointment.getSlot().getEndTime(),
            appointment.getStatus()
    );
}
}