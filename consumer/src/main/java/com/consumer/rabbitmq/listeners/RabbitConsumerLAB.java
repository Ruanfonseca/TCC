package com.consumer.rabbitmq.listeners;

import com.consumer.rabbitmq.abstracts.Consumer;
import com.consumer.rabbitmq.service.ConsumerService;
import com.consumer.rabbitmq.templates.TemplateMSG;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RabbitConsumerLAB extends Consumer {

    @Autowired
    ConsumerService service;

    @RabbitListener(queues = "LABORATORIO")
    public void consumeMessage(TemplateMSG msg)
    {
        service.sendtoMail(msg);

    }



}
