package com.ssafy.alttab.study.service;

import com.ssafy.alttab.common.jointable.entity.MemberStudy;
import com.ssafy.alttab.common.jointable.repository.MemberStudyRepository;
import com.ssafy.alttab.member.dto.MemberDto;
import com.ssafy.alttab.study.dto.StudyInfoRequestDto;
import com.ssafy.alttab.study.entity.StudyInfo;
import com.ssafy.alttab.study.repository.StudyInfoRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyInfoService {

    private final JavaMailSender mailSender;
    private final StudyInfoRepository studyInfoRepository;
    private final MemberStudyRepository memberStudyRepository;

    @Transactional
    public ResponseEntity<String> createStudy(StudyInfoRequestDto studyInfoRequestDto) {

        StudyInfo studyInfo = StudyInfo.createStudy(studyInfoRequestDto);
        studyInfoRepository.save(studyInfo);

//        for (String email : studyInfoRequestDto.getStudyEmails()) {
//            sendInvitationEmail(email, studyInfoRequestDto.getStudyName());
//        }

        return ResponseEntity.ok().body("Study created successfully");
    }

    private void sendInvitationEmail(String to, String studyName) {

        MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            mimeMessageHelper.setTo(to);
            mimeMessageHelper.setSubject(studyName + " 스터디 초대");
            mimeMessageHelper.setText("안녕하세요, " + studyName + " 스터디에 초대되었습니다.");
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    public ResponseEntity<List<MemberDto>> getMembersByStudy(Long studyId) {

        StudyInfo studyInfo = findStudyByIdOrThrow(studyId);
        List<MemberStudy> memberStudies = memberStudyRepository.findByStudyInfo(studyInfo);

        return ResponseEntity.ok().body(memberStudies.stream()
                .map(memberStudy -> MemberDto.fromEntity(memberStudy.getMember()))
                .collect(Collectors.toList()));
    }

    private StudyInfo findStudyByIdOrThrow(Long studyId) {

        return studyInfoRepository.findById(studyId)
                .orElseThrow(() -> new IllegalArgumentException("Study not found"));
    }
}
