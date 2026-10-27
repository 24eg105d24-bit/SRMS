package com.srms.studentmanagement.exception;

public class DuplicateRollNumberException extends RuntimeException {
    public DuplicateRollNumberException(String message) {
        super(message);
    }
}
