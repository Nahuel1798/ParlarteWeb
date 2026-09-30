package com.parlarte.parlarte.service;

import com.parlarte.parlarte.dto.CursoResumenResponse;
import com.parlarte.parlarte.entity.Curso;
import com.parlarte.parlarte.repository.ClaseRepository;
import com.parlarte.parlarte.repository.MaterialRepository;
import com.parlarte.parlarte.repository.TareaRepository;
import com.parlarte.parlarte.repository.TestRepository;
import com.parlarte.parlarte.repository.VideoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CursoResumenService {

    private final ClaseAccesoService claseAccesoService;
    private final ClaseRepository claseRepository;
    private final VideoRepository videoRepository;
    private final MaterialRepository materialRepository;
    private final TareaRepository tareaRepository;
    private final TestRepository testRepository;

    public CursoResumenService(ClaseAccesoService claseAccesoService,
                               ClaseRepository claseRepository,
                               VideoRepository videoRepository,
                               MaterialRepository materialRepository,
                               TareaRepository tareaRepository,
                               TestRepository testRepository) {
        this.claseAccesoService = claseAccesoService;
        this.claseRepository = claseRepository;
        this.videoRepository = videoRepository;
        this.materialRepository = materialRepository;
        this.tareaRepository = tareaRepository;
        this.testRepository = testRepository;
    }

    @Transactional(readOnly = true)
    public CursoResumenResponse obtener(Long cursoId, String email) {
        Curso curso = claseAccesoService.buscarCurso(cursoId);
        claseAccesoService.verificarAccesoLecturaPorCurso(curso, email);

        CursoResumenResponse resumen = new CursoResumenResponse();
        resumen.setCursoId(cursoId);
        resumen.setModulos(claseRepository.countModulosDistintos(cursoId));
        resumen.setClases(claseRepository.countByCursoId(cursoId));
        resumen.setVideos(videoRepository.countByClase_Curso_Id(cursoId));
        resumen.setMateriales(materialRepository.countByClase_Curso_Id(cursoId));
        resumen.setTareas(tareaRepository.countByClase_Curso_Id(cursoId));
        resumen.setTests(testRepository.countByClase_Curso_Id(cursoId));

        return resumen;
    }
}
