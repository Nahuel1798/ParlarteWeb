package com.parlarte.parlarte.service;

import com.parlarte.parlarte.dto.PreguntaRequest;
import com.parlarte.parlarte.dto.TestRequest;
import com.parlarte.parlarte.dto.TestResponse;
import com.parlarte.parlarte.entity.Clase;
import com.parlarte.parlarte.entity.Pregunta;
import com.parlarte.parlarte.entity.Respuesta;
import com.parlarte.parlarte.entity.Test;
import com.parlarte.parlarte.exception.ResourceNotFoundException;
import com.parlarte.parlarte.repository.PreguntaRepository;
import com.parlarte.parlarte.repository.RespuestaRepository;
import com.parlarte.parlarte.repository.TestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TestService {

    private final TestRepository testRepository;
    private final PreguntaRepository preguntaRepository;
    private final RespuestaRepository respuestaRepository;
    private final ClaseAccesoService claseAccesoService;

    public TestService(TestRepository testRepository,
                       PreguntaRepository preguntaRepository,
                       RespuestaRepository respuestaRepository,
                       ClaseAccesoService claseAccesoService) {
        this.testRepository = testRepository;
        this.preguntaRepository = preguntaRepository;
        this.respuestaRepository = respuestaRepository;
        this.claseAccesoService = claseAccesoService;
    }

    @Transactional(readOnly = true)
    public List<TestResponse> listarPorClase(Long cursoId, Long claseId, String email) {
        Clase clase = claseAccesoService.buscarClase(claseId);
        claseAccesoService.verificarAccesoPorClase(cursoId, clase, email);
        return testRepository.findByClaseIdOrderByIdAsc(claseId).stream()
                .map(TestResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public TestResponse crear(Long cursoId, Long claseId, TestRequest request, String email) {
        Clase clase = claseAccesoService.buscarClase(claseId);
        claseAccesoService.verificarAccesoPorClase(cursoId, clase, email);

        Test test = new Test();
        test.setTitulo(request.getTitulo().trim());
        test.setPorcentajeAprobacion(request.getPorcentajeAprobacion().trim());
        test.setClase(clase);
        test = testRepository.save(test);

        guardarPreguntas(test, request);
        return TestResponse.fromEntity(recargar(test.getId()));
    }

    @Transactional
    public TestResponse actualizar(Long cursoId, Long claseId, Long testId, TestRequest request, String email) {
        Clase clase = claseAccesoService.buscarClase(claseId);
        claseAccesoService.verificarAccesoPorClase(cursoId, clase, email);

        Test test = buscarTestEnClase(testId, claseId);
        test.setTitulo(request.getTitulo().trim());
        test.setPorcentajeAprobacion(request.getPorcentajeAprobacion().trim());
        testRepository.save(test);

        eliminarPreguntas(test);
        guardarPreguntas(test, request);
        return TestResponse.fromEntity(recargar(test.getId()));
    }

    @Transactional
    public void eliminar(Long cursoId, Long claseId, Long testId, String email) {
        Clase clase = claseAccesoService.buscarClase(claseId);
        claseAccesoService.verificarAccesoPorClase(cursoId, clase, email);

        Test test = buscarTestEnClase(testId, claseId);
        eliminarPreguntas(test);
        testRepository.delete(test);
    }

    private void guardarPreguntas(Test test, TestRequest request) {
        if (request.getPreguntas() == null) {
            return;
        }

        for (PreguntaRequest preguntaRequest : request.getPreguntas()) {
            Pregunta pregunta = new Pregunta();
            pregunta.setEnunciado(preguntaRequest.getEnunciado().trim());
            pregunta.setTest(test);
            pregunta = preguntaRepository.save(pregunta);

            if (preguntaRequest.getRespuestas() == null) {
                continue;
            }

            for (var respuestaRequest : preguntaRequest.getRespuestas()) {
                Respuesta respuesta = new Respuesta();
                respuesta.setTexto(respuestaRequest.getTexto().trim());
                respuesta.setCorrecta(Boolean.TRUE.equals(respuestaRequest.getCorrecta()));
                respuesta.setPregunta(pregunta);
                respuestaRepository.save(respuesta);
            }
        }
    }

    private void eliminarPreguntas(Test test) {
        for (Pregunta pregunta : test.getPreguntas()) {
            for (Respuesta respuesta : pregunta.getRespuestas()) {
                respuestaRepository.delete(respuesta);
            }
            preguntaRepository.delete(pregunta);
        }
    }

    private Test buscarTestEnClase(Long testId, Long claseId) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("Test no encontrado con id: " + testId));
        if (!test.getClase().getId().equals(claseId)) {
            throw new ResourceNotFoundException("Test no encontrado en la clase indicada");
        }
        return test;
    }

    private Test recargar(Long testId) {
        return testRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("Test no encontrado con id: " + testId));
    }
}