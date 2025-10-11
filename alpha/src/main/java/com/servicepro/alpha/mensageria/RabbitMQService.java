package com.servicepro.alpha.mensageria;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQService {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private ObjectMapper obj;


    public void enviaMensagem(String nomefila, Object mensagem) {
        try {
            String mensagemjson = this.obj.writeValueAsString(mensagem);

            MessageProperties props = new MessageProperties();
            props.setContentType("application/json");

            Message msg = new Message(mensagemjson.getBytes(), props);

            this.rabbitTemplate.send(nomefila, msg);
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }
}
