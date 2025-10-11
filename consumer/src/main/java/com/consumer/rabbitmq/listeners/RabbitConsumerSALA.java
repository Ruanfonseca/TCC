package com.consumer.rabbitmq.listeners;

import com.consumer.rabbitmq.abstracts.Consumer;
import com.consumer.rabbitmq.service.ConsumerService;
import com.consumer.rabbitmq.templates.TemplateMSG;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class RabbitConsumerSALA extends Consumer {

    @Autowired
    ConsumerService service;

    @RabbitListener(queues = "SALA")
    public void consumeMessage(TemplateMSG msg)
    {
        service.sendtoMail(msg);

    }



}
