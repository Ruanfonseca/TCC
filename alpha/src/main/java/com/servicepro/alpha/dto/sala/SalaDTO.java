package com.servicepro.alpha.dto.sala;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class SalaDTO {
     String name;
     String block;
     String capacity;
     String type;
     List<String> equipment;
     String status;
     String floor;
     String description;
}
