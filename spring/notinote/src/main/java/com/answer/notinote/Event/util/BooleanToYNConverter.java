package com.answer.notinote.Event.util;

import javax.persistence.AttributeConverter;

public class BooleanToYNConverter implements AttributeConverter<Boolean, String> {
    @Override
    public String convertToDatabaseColumn(Boolean bool) {
        return (bool != null && bool) ? "Y" : "N";
    }

    @Override
    public Boolean convertToEntityAttribute(String yn) {
        return "Y".equalsIgnoreCase(yn);
    }
}