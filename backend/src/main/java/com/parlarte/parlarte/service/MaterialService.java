package com.parlarte.parlarte.service;

import com.parlarte.parlarte.dto.MaterialRequest;
import com.parlarte.parlarte.dto.MaterialResponse;
import com.parlarte.parlarte.entity.Clase;
import com.parlarte.parlarte.entity.Material;
import com.parlarte.parlarte.exception.ResourceNotFoundException;
import com.parlarte.parlarte.repository.MaterialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final ClaseAccesoService claseAccesoService;

    public MaterialService(MaterialRepository materialRepository, ClaseAccesoService claseAccesoService) {
        this.materialRepository = materialRepository;
        this.claseAccesoService = claseAccesoService;
    }

    @Transactional(readOnly = true)
    public List<MaterialResponse> listarPorClase(Long cursoId, Long claseId, String email) {
        Clase clase = claseAccesoService.buscarClase(claseId);
        claseAccesoService.verificarAccesoPorClase(cursoId, clase, email);
        return materialRepository.findByClaseIdOrderByIdAsc(claseId).stream()
                .map(MaterialResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public MaterialResponse crear(Long cursoId, Long claseId, MaterialRequest request, String email) {
        Clase clase = claseAccesoService.buscarClase(claseId);
        claseAccesoService.verificarAccesoPorClase(cursoId, clase, email);

        Material material = new Material();
        material.setTitulo(request.getTitulo().trim());
        material.setTipo(request.getTipo().trim());
        material.setUrl(request.getUrl().trim());
        material.setClase(clase);

        return MaterialResponse.fromEntity(materialRepository.save(material));
    }

    @Transactional
    public MaterialResponse actualizar(Long cursoId, Long claseId, Long materialId, MaterialRequest request, String email) {
        Clase clase = claseAccesoService.buscarClase(claseId);
        claseAccesoService.verificarAccesoPorClase(cursoId, clase, email);

        Material material = buscarMaterialEnClase(materialId, claseId);
        material.setTitulo(request.getTitulo().trim());
        material.setTipo(request.getTipo().trim());
        material.setUrl(request.getUrl().trim());

        return MaterialResponse.fromEntity(materialRepository.save(material));
    }

    @Transactional
    public void eliminar(Long cursoId, Long claseId, Long materialId, String email) {
        Clase clase = claseAccesoService.buscarClase(claseId);
        claseAccesoService.verificarAccesoPorClase(cursoId, clase, email);

        Material material = buscarMaterialEnClase(materialId, claseId);
        materialRepository.delete(material);
    }

    private Material buscarMaterialEnClase(Long materialId, Long claseId) {
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new ResourceNotFoundException("Material no encontrado con id: " + materialId));
        if (!material.getClase().getId().equals(claseId)) {
            throw new ResourceNotFoundException("Material no encontrado en la clase indicada");
        }
        return material;
    }
}