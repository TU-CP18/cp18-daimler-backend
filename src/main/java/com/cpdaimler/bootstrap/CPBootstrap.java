package com.cpdaimler.bootstrap;

import com.cpdaimler.domain.*;
import com.cpdaimler.domain.enumeration.CARSTATUS;
import com.cpdaimler.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.ThreadLocalRandom;

@Component
public class CPBootstrap implements CommandLineRunner {

    private final SafetyDriverRepository safetyDriverRepository;

    private final UserRepository userRepository;

    private final ShiftRepository shiftRepository;

    private final CarRepository carRepository;

    private final CarLicenceRepository carLicenceRepository;

    private final CarLicence carLicence;


    public CPBootstrap(SafetyDriverRepository safetyDriverRepository, UserRepository userRepository, ShiftRepository shiftRepository, CarRepository carRepository, CarLicenceRepository carLicenceRepository) {
        this.safetyDriverRepository = safetyDriverRepository;
        this.userRepository = userRepository;
        this.shiftRepository = shiftRepository;
        this.carRepository = carRepository;
        this.carLicenceRepository = carLicenceRepository;

        this.carLicence = carLicenceRepository.findById(2L).get();

    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        if (safetyDriverRepository.findAll().isEmpty()) {

            initSafetyDriver();
            initCars();
            initShift();
        }
    }

    private void initShift() {

        Shift s = new Shift();
        s.setCar(carRepository.getOne(1L));
        s.setSafetyDriver(safetyDriverRepository.getOne(1L));
        s.setStart(System.currentTimeMillis() + 518400000);
        s.setEnd(System.currentTimeMillis() + 518400000 + 14400000);
        getRandomLatLon(s);
        shiftRepository.save(s);

        s = new Shift();
        s.setCar(carRepository.getOne(1L));
        s.setSafetyDriver(safetyDriverRepository.getOne(1L));
        s.setStart(System.currentTimeMillis() + 518400000 * 2);
        s.setEnd(System.currentTimeMillis() + 518400000 * 2 + 14400000);
        getRandomLatLon(s);
        shiftRepository.save(s);

        s = new Shift();
        s.setCar(carRepository.getOne(1L));
        s.setSafetyDriver(safetyDriverRepository.getOne(1L));
        s.setStart(System.currentTimeMillis() + 518400000 * 8);
        s.setEnd(System.currentTimeMillis() + 518400000 * 8 + 14400000);
        getRandomLatLon(s);
        shiftRepository.save(s);

    }

    private void initSafetyDriver() {

        User u = userRepository.findOneByLogin("driver").get();

        SafetyDriver safetyDriver = new SafetyDriver();
        safetyDriver.setLogin("driver");
        safetyDriver.setUser(u);
        safetyDriver.getLicences().add(carLicence);

        safetyDriverRepository.save(safetyDriver);

        u = userRepository.findOneByLogin("user").get();

        safetyDriver = new SafetyDriver();
        safetyDriver.setLogin("user");
        safetyDriver.setUser(u);
        safetyDriver.getLicences().add(carLicence);

        safetyDriverRepository.save(safetyDriver);

        u = userRepository.findOneByLogin("admin").get();

        safetyDriver = new SafetyDriver();
        safetyDriver.setLogin("admin");
        safetyDriver.setUser(u);
        safetyDriver.getLicences().add(carLicence);

        safetyDriverRepository.save(safetyDriver);
    }

    private void initCars() {

        Car c1 = new Car();
        c1.setLicence(carLicence);
        c1.setModel("E Klasse");
        c1.setStatus(CARSTATUS.AVAILABLE);

        carRepository.save(c1);

        c1 = new Car();
        c1.setLicence(carLicence);
        c1.setModel("B Klasse");
        c1.setStatus(CARSTATUS.AVAILABLE);

        carRepository.save(c1);

        c1 = new Car();
        c1.setLicence(carLicence);
        c1.setModel("A Klasse");
        c1.setStatus(CARSTATUS.AVAILABLE);

        carRepository.save(c1);

        c1 = new Car();
        c1.setLicence(carLicence);
        c1.setModel("S Klasse");
        c1.setStatus(CARSTATUS.AVAILABLE);

        carRepository.save(c1);

    }


    private void getRandomLatLon(Shift shift) {

        Double random = ThreadLocalRandom.current().nextDouble() * 0.1;
        Double sign = ThreadLocalRandom.current().nextDouble();

        if (sign > 0.5) {
            random = random * -1;
        }

        Double lat = 52.531677 + random;
        Double lng = 13.381777 + random;

        shift.setLatStart(lat);
        shift.setLongStart(lng);
    }
}
