package com.parlarte.parlarte.service;

import com.parlarte.parlarte.dto.VideoRequest;
import com.parlarte.parlarte.dto.VideoResponse;
import com.parlarte.parlarte.entity.Clase;
import com.parlarte.parlarte.entity.Videos;
import com.parlarte.parlarte.exception.ResourceNotFoundException;
import com.parlarte.parlarte.repository.VideoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VideoService {

    private final VideoRepository videoRepository;
    private final ClaseAccesoService claseAccesoService;

    public VideoService(VideoRepository videoRepository, ClaseAccesoService claseAccesoService) {
        this.videoRepository = videoRepository;
        this.claseAccesoService = claseAccesoService;
    }

    @Transactional(readOnly = true)
    public List<VideoResponse> listarPorClase(Long cursoId, Long claseId, String email) {
        Clase clase = claseAccesoService.buscarClase(claseId);
        claseAccesoService.verificarAccesoLecturaPorClase(cursoId, clase, email);
        return videoRepository.findByClaseIdOrderByIdAsc(claseId).stream()
                .map(VideoResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public VideoResponse crear(Long cursoId, Long claseId, VideoRequest request, String email) {
        Clase clase = claseAccesoService.buscarClase(claseId);
        claseAccesoService.verificarAccesoPorClase(cursoId, clase, email);

        Videos video = new Videos();
        video.setTitulo(request.getTitulo().trim());
        video.setUrl(request.getUrl().trim());
        video.setDuracionSegundos(request.getDuracionSegundos());
        video.setClase(clase);

        return VideoResponse.fromEntity(videoRepository.save(video));
    }

    @Transactional
    public VideoResponse actualizar(Long cursoId, Long claseId, Long videoId, VideoRequest request, String email) {
        Clase clase = claseAccesoService.buscarClase(claseId);
        claseAccesoService.verificarAccesoPorClase(cursoId, clase, email);

        Videos video = buscarVideoEnClase(videoId, claseId);
        video.setTitulo(request.getTitulo().trim());
        video.setUrl(request.getUrl().trim());
        video.setDuracionSegundos(request.getDuracionSegundos());

        return VideoResponse.fromEntity(videoRepository.save(video));
    }

    @Transactional
    public void eliminar(Long cursoId, Long claseId, Long videoId, String email) {
        Clase clase = claseAccesoService.buscarClase(claseId);
        claseAccesoService.verificarAccesoPorClase(cursoId, clase, email);

        Videos video = buscarVideoEnClase(videoId, claseId);
        videoRepository.delete(video);
    }

    private Videos buscarVideoEnClase(Long videoId, Long claseId) {
        Videos video = videoRepository.findById(videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Video no encontrado con id: " + videoId));
        if (!video.getClase().getId().equals(claseId)) {
            throw new ResourceNotFoundException("Video no encontrado en la clase indicada");
        }
        return video;
    }
}