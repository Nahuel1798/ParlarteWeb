package com.parlarte.parlarte.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> notFound(ResourceNotFoundException ex) {
        return Map.of("error", ex.getMessage());
    }

    @ExceptionHandler(ConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> conflict(ConflictException ex) {
        return Map.of("error", ex.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, String> badCredentials(BadCredentialsException ex) {
        return Map.of("error", "Credenciales inválidas");
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public Map<String, String> accessDenied(AccessDeniedException ex) {
        return Map.of("error", ex.getMessage() != null ? ex.getMessage() : "Acceso denegado");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> validation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return Map.of("error", message);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> dataIntegrity(DataIntegrityViolationException ex) {
        return Map.of("error", "Violación de integridad de datos");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> badRequest(IllegalArgumentException ex) {
        return Map.of("error", ex.getMessage() != null ? ex.getMessage() : "Solicitud inválida");
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> maxUploadSize(MaxUploadSizeExceededException ex) {
        return Map.of("error", "El archivo supera el tamaño máximo permitido (500MB)");
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> cuerpoIlegible(HttpMessageNotReadableException ex) {
        return Map.of("error", describirCuerpoIlegible(ex));
    }

    private static final Pattern VALOR_RECIBIDO = Pattern.compile("from String \"([^\"]*)\"");

    private static final Pattern CAMPO = Pattern.compile("reference chain: .*\\[\"([^\"]+)\"\\]\\)\\s*$");

    private static final Pattern VALORES_ENUM = Pattern.compile("Enum class: \\[([^]]*)]");

    private String describirCuerpoIlegible(HttpMessageNotReadableException ex) {
        String mensaje = ex.getMostSpecificCause().getMessage();
        if (mensaje == null || !mensaje.contains("Cannot deserialize value of type")) {
            return "El cuerpo de la petición no es un JSON válido";
        }

        StringBuilder descripcion = new StringBuilder("Valor inválido en el cuerpo de la petición");

        Matcher campo = CAMPO.matcher(mensaje);
        if (campo.find()) {
            descripcion.append(", campo \"").append(campo.group(1)).append("\"");
        }

        Matcher recibido = VALOR_RECIBIDO.matcher(mensaje);
        if (recibido.find()) {
            descripcion.append(": \"").append(recibido.group(1)).append("\"");
        }

        Matcher valores = VALORES_ENUM.matcher(mensaje);
        if (valores.find()) {
            List<String> permitidos = Arrays.stream(valores.group(1).split(","))
                    .map(String::trim)
                    .filter(valor -> !valor.isEmpty())
                    .sorted()
                    .toList();
            if (!permitidos.isEmpty()) {
                descripcion.append(". Valores permitidos: ").append(String.join(", ", permitidos));
            }
        }

        return descripcion.toString();
    }
}