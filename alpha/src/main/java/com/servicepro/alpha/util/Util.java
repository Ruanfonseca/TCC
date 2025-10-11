package com.servicepro.alpha.util;

import lombok.experimental.UtilityClass;

import java.util.Random;

@UtilityClass
public class Util {

    public String generateToken() {
        int year = java.time.Year.now().getValue();
        int randomNum = new Random().nextInt(10000); // 0 até 9999
        String formattedNum = String.format("%04d", randomNum); // completa com zeros à esquerda
        return String.format("SOL-%d-%s", year, formattedNum);
    }

}
