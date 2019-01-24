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
        initSafetyDriver();

        initCars();

        initShift();

        System.out.println("Not working: "+safetyDriverRepository.findNumberOfInactiveSafetyDrivers(System.currentTimeMillis()));
        System.out.println("Working: "+safetyDriverRepository.findNumberOfWorkingSafetyDrivers(System.currentTimeMillis()));

    }

    private void initShift() {

        long t1 = 1550133000000L; // 8:30
        long t2 = 1550131200000L; // 8:00
        long t3 = 1550134800000L; // 9:00
        long t4 = 1550149200000L; // 13:00
        long t5 = 1550152800000L; // 14:00
        long t6 = 1550147400000L; // 12:30
        long t7 = 1550145600000L; // 12:00

        // 8:30, driver 1, car 1
        Shift s = new Shift();
        s.setCar(carRepository.getOne(1L));
        s.setSafetyDriver(safetyDriverRepository.getOne(1L));
        s.setStart(t1);
        s.setEnd(t1 + 14400000);
        getRandomLatLon(s);
        shiftRepository.save(s);

        // 8:00, driver 2, car 2
        s = new Shift();
        s.setCar(carRepository.getOne(2L));
        s.setSafetyDriver(safetyDriverRepository.getOne(2L));
        s.setStart(t2);
        s.setEnd(t2 + 14400000);
        getRandomLatLon(s);
        shiftRepository.save(s);

        // 9:00, driver 3, car 3
        s = new Shift();
        s.setCar(carRepository.getOne(3L));
        s.setSafetyDriver(safetyDriverRepository.getOne(3L));
        s.setStart(t3);
        s.setEnd(t3 + 14400000);
        getRandomLatLon(s);
        shiftRepository.save(s);

        // 9:00, driver 4, car 4
        s = new Shift();
        s.setCar(carRepository.getOne(4L));
        s.setSafetyDriver(safetyDriverRepository.getOne(4L));
        s.setStart(t3);
        s.setEnd(t3 + 14400000);
        getRandomLatLon(s);
        shiftRepository.save(s);

        // 8:00, driver 8, car 5
        s = new Shift();
        s.setCar(carRepository.getOne(5L));
        s.setSafetyDriver(safetyDriverRepository.getOne(8L));
        s.setStart(t3);
        s.setEnd(t3 + 14400000);
        getRandomLatLon(s);
        shiftRepository.save(s);

        // 13:00, driver 2, car 6
        s = new Shift();
        s.setCar(carRepository.getOne(6L));
        s.setSafetyDriver(safetyDriverRepository.getOne(2L));
        s.setStart(t4);
        s.setEnd(t4 + 14400000);
        getRandomLatLon(s);
        shiftRepository.save(s);

        // 14:00, driver 3, car 7
        s = new Shift();
        s.setCar(carRepository.getOne(7L));
        s.setSafetyDriver(safetyDriverRepository.getOne(3L));
        s.setStart(t5);
        s.setEnd(t5 + 14400000);
        getRandomLatLon(s);
        shiftRepository.save(s);

        // 14:00, driver 4, car 4
        s = new Shift();
        s.setCar(carRepository.getOne(4L));
        s.setSafetyDriver(safetyDriverRepository.getOne(4L));
        s.setStart(t5);
        s.setEnd(t5 + 14400000);
        getRandomLatLon(s);
        shiftRepository.save(s);

        // 12:30, driver 5, car 1
        s = new Shift();
        s.setCar(carRepository.getOne(1L));
        s.setSafetyDriver(safetyDriverRepository.getOne(5L));
        s.setStart(t6);
        s.setEnd(t6 + 14400000);
        getRandomLatLon(s);
        shiftRepository.save(s);

        // 13:00, driver 6, car 3
        s = new Shift();
        s.setCar(carRepository.getOne(3L));
        s.setSafetyDriver(safetyDriverRepository.getOne(6L));
        s.setStart(t4);
        s.setEnd(t4 + 14400000);
        getRandomLatLon(s);
        shiftRepository.save(s);

        // 12:00, driver 7, car 2
        s = new Shift();
        s.setCar(carRepository.getOne(2L));
        s.setSafetyDriver(safetyDriverRepository.getOne(7L));
        s.setStart(t7);
        s.setEnd(t7 + 14400000);
        getRandomLatLon(s);
        shiftRepository.save(s);

        // 13:00, driver 8, car 5
        s = new Shift();
        s.setCar(carRepository.getOne(5L));
        s.setSafetyDriver(safetyDriverRepository.getOne(8L));
        s.setStart(t4);
        s.setEnd(t4 + 14400000);
        getRandomLatLon(s);
        shiftRepository.save(s);
    }

    private void initSafetyDriver() {
        
        for(int i = 1; i < 10; i++) {
            User u = userRepository.findOneByLogin("driver" + i).get();
            SafetyDriver safetyDriver = new SafetyDriver();
            safetyDriver.setLogin("driver" + i);
            safetyDriver.setUser(u);
            safetyDriver.getLicences().add(carLicence);
            safetyDriverRepository.save(safetyDriver);
        }
    }

    private void initCars() {

        for(int i = 0; i < 10; i++) {
            Car c = new Car();
            c.setLicence(carLicence);
            c.setModel("URBANETIC");
            c.setStatus(CARSTATUS.AVAILABLE);
            carRepository.save(c);
        }
    }


    private void getRandomLatLon(Shift shift) {

        Double random = ThreadLocalRandom.current().nextDouble() * 0.1;
        Double sign = ThreadLocalRandom.current().nextDouble();

        if(sign > 0.5) {
            random = random * -1;
        }

        Double lat = 52.531677 +random;
        Double lng= 13.381777 +random;

        shift.setLatStart(lat);
        shift.setLongStart(lng);
    }
}
