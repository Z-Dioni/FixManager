package com.fixmanager.fixmanagerbackend.service;

import com.fixmanager.fixmanagerbackend.entity.MouvementCaisse;
import com.fixmanager.fixmanagerbackend.repository.MouvementCaisseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MouvementCaisseService {
    private final MouvementCaisseRepository repository;

    public MouvementCaisseService(MouvementCaisseRepository repository) {
        this.repository = repository;
    }

    public List<MouvementCaisse> findAll() { return repository.findAll(); }
    public Optional<MouvementCaisse> findById(Long id) { return repository.findById(id); }
    public MouvementCaisse save(MouvementCaisse mouvementCaisse) {
        return repository.save(mouvementCaisse);
    }
    public void deleteById(Long id) { repository.deleteById(id); }
}