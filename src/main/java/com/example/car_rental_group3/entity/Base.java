package com.example.car_rental_group3.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;

@Getter
@Setter
@MappedSuperclass
@FieldDefaults(level = AccessLevel.PRIVATE)
@EntityListeners(AuditingEntityListener.class)
public class Base {
    private static final long serialVersionUID = -863164858986274318L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @CreatedDate
    LocalDate createdAt;

    @LastModifiedDate
    LocalDate modifiedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDate.now();
        modifiedAt = null;
    }
}
