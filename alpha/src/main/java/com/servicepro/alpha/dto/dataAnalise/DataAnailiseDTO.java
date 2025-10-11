package com.servicepro.alpha.dto.dataAnalise;

import lombok.Data;

@Data
public class DataAnailiseDTO {
    private long qtdApproved;
    private long qtdPending;
    private long qtdRejected;
    private long qtdCancelled;
    private long qtdTotal;
}
