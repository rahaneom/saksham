package com.saksham.service;

import com.saksham.dto.CounsellorAppointmentResponse;
import com.saksham.dto.StudentAppointmentResponse;
import com.saksham.entity.*;
import com.saksham.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final SlotRepository slotRepository;
    private final UserRepository userRepository;

    // 🔵 Book Appointment
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

        // 3️⃣ Check availability
        if (!slot.isAvailable()) {
            throw new RuntimeException("Slot already booked");
        }

        // 4️⃣ Mark slot unavailable
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

    // 🔵 Get appointments for a student
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

    // 🔵 Get all appointments (for counsellor)
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
}