package com.servicepro.alpha.mensageria;

import org.springframework.amqp.core.AmqpAdmin;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class RabbitMQConexao implements ApplicationRunner {

    private static final String NOME_EXCHANGE = "amq.direct";

    private final AmqpAdmin ampqAdmin;

    public RabbitMQConexao(AmqpAdmin ampqAdmin){
        this.ampqAdmin = ampqAdmin;
    }

    private Queue fila(String nomeFila){
        return new Queue(nomeFila, true, false, false);
    }

    private DirectExchange envioDeMsg() {
        return new DirectExchange(NOME_EXCHANGE);
    }

    private Binding relacionamento(Queue fila, DirectExchange enviomsg) {
        return new Binding(fila.getName(), Binding.DestinationType.QUEUE, enviomsg.getName(), fila.getName(), null);
    }


    @Override
    public void run(ApplicationArguments args) throws Exception {

        Queue filaRequerimentoSALA = this.fila(RabbbitMQConstantes.FILA_SALA);
        Queue filaRequerimentoLAB = this.fila(RabbbitMQConstantes.FILA_LAB);

        DirectExchange enviomsg = this.envioDeMsg();
        Binding LigacaoSALA = this.relacionamento(filaRequerimentoSALA, enviomsg);
        Binding LigacaoLAB = this.relacionamento(filaRequerimentoLAB, enviomsg);

        //criando as filas no RabbitMQ
        this.ampqAdmin.declareQueue(filaRequerimentoSALA);
        this.ampqAdmin.declareQueue(filaRequerimentoLAB);

        //canal onde as filas estarão
        this.ampqAdmin.declareExchange(enviomsg);
        this.ampqAdmin.declareBinding(LigacaoSALA);
        this.ampqAdmin.declareBinding(LigacaoLAB);
    }

}
