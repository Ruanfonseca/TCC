package com.consumer.rabbitmq.service;

import com.consumer.rabbitmq.templates.TemplateMSG;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ConsumerService {

    private final JavaMailSender javaMailSender;

    public ConsumerService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendtoMail(TemplateMSG msg){
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("suporteserviceprosuporte@gmail.com");
            message.setTo(msg.getEmail());
            message.setSubject("Equipe de Apoio a logística UERJ/ZO");
            message.setText(msg.getMsg());
            javaMailSender.send(message);

            System.out.println("E-mail enviado com sucesso!");

        } catch (Exception e) {
            System.out.println("Erro ao enviar o e-mail: ");
            e.printStackTrace();

        }
    }
}
