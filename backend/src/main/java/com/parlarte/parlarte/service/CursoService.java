package com.parlarte.parlarte.service;

import org.springframework.stereotype.Service;
import com.parlarte.parlarte.entity.Curso;
import com.parlarte.parlarte.exception.ConflictException;
import com.parlarte.parlarte.exception.ResourceNotFoundException;
import com.parlarte.parlarte.repository.CursoRepository;

import java.util.List;

@Service 
public class CursoService {
    
    private final CursoRepository cursoRepository;

    public CursoService(CursoRepository cursoRepository) {
        this.cursoRepository = cursoRepository;
    }

    public CursoRepository getCursoRepository() {
        return cursoRepository;
    }

    public List<Curso> listarTodos() {
        return cursoRepository.findAll();
    }

    public Curso buscarPorId(Long id) {
        return cursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + id));
    }

    public Curso crear(Curso curso) {
        if (cursoRepository.existsByNombre(curso.getNombre())) {
            throw new ConflictException("Ya existe un curso con el nombre: " + curso.getNombre());
        }
        return cursoRepository.save(curso);
    }

    public Curso actualizar(Long id, Curso cursoActualizado) {
        Curso cursoExistente = cursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + id));

        if (!cursoExistente.getNombre().equals(cursoActualizado.getNombre()) &&
                cursoRepository.existsByNombre(cursoActualizado.getNombre())) {
            throw new ConflictException("Ya existe un curso con el nombre: " + cursoActualizado.getNombre());
        }

        cursoExistente.setNombre(cursoActualizado.getNombre());
        cursoExistente.setDescripcion(cursoActualizado.getDescripcion());
        // Actualizar otros campos según sea necesario

        return cursoRepository.save(cursoExistente);
    }

    public void eliminar(Long id) {
        Curso cursoExistente = cursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + id));
        cursoRepository.delete(cursoExistente);
    }

    public List<Curso> buscarPorNombre(String nombre) {
        return cursoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public Curso buscarPorNombreExacto(String nombre) {
        return cursoRepository.findByNombre(nombre)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con nombre: " + nombre));
    }
}
