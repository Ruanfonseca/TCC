package com.servicepro.alpha.util;

import java.time.Year;
import java.util.Random;

public class TokenGenerator {

    private static final Random RANDOM = new Random();

    /**
     * Gera um token no formato PREFIXO-ANO-XXXX
     * Exemplo: LAB-2025-0345
     */
    public static String generateToken(String prefix) {
        int year = Year.now().getValue();
        int randomNum = RANDOM.nextInt(10000); // 0 até 9999
        String formattedNum = String.format("%04d", randomNum); // completa com zeros à esquerda
        return String.format("%s-%d-%s", prefix.toUpperCase(), year, formattedNum);
    }

    /** Gera token para Laboratório */
    public static String generateLabToken() {
        return generateToken("LAB");
    }

    /** Gera token para Sala */
    public static String generateSalToken() {
        return generateToken("SAL");
    }

}