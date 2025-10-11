package com.consumer.rabbitmq.abstracts;

import com.consumer.rabbitmq.templates.TemplateMSG;

public abstract class Consumer {
    public void consumeMessage(TemplateMSG message) {}
    public void sendtoMail(TemplateMSG message){}
}

