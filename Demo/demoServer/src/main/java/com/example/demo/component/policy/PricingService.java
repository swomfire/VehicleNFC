package com.example.demo.component.policy;

import com.example.demo.component.policy.PolicyInstanceHasTblVehicleType;
import com.example.demo.component.policy.Pricing;
import com.example.demo.component.policy.PolicyInstanceHasVehicleTypeRepository;
import com.example.demo.component.policy.PricingRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PricingService {
    private final PricingRepository pricingRepository;
    private final PolicyInstanceHasVehicleTypeRepository policyInstanceHasVehicleTypeRepository;

    public PricingService(PricingRepository pricingRepository, PolicyInstanceHasVehicleTypeRepository policyInstanceHasVehicleTypeRepository) {
        this.pricingRepository = pricingRepository;
        this.policyInstanceHasVehicleTypeRepository = policyInstanceHasVehicleTypeRepository;
    }

    public Pricing findByPolicyHasVehicleTypeId(Integer policyHasVehicleTypeId) {
        Optional<PolicyInstanceHasTblVehicleType> policyHasTblVehicleType = policyInstanceHasVehicleTypeRepository.findById(policyHasVehicleTypeId);
        if (policyHasTblVehicleType.isPresent()) {
            PolicyInstanceHasTblVehicleType policyHasTblVehicleTypeDB = policyHasTblVehicleType.get();
            //TODO
//            Pricing pricing = pricingRepository.findAllByPolicyHasTblVehicleTypeId(policyHasTblVehicleTypeDB.getId());
            Pricing pricing = null;
            return pricing;
        }
        return null;
    }

    //Todo
    public List<Pricing> findAllByPolicyHasTblVehicleTypeId(Integer policyHasTblVehicleTypeId) {
        Optional<PolicyInstanceHasTblVehicleType> policyHasTblVehicleType = policyInstanceHasVehicleTypeRepository.findById(policyHasTblVehicleTypeId);
        if (policyHasTblVehicleType.isPresent()) {
            PolicyInstanceHasTblVehicleType policyHasTblVehicleTypeDB = policyHasTblVehicleType.get();
//            List<Pricing> pricings = pricingRepository.findAllByPolicyHasTblVehicleTypeId(policyHasTblVehicleTypeDB.getId());
//            return pricings;
            return null;
        }
        return null;
    }

    public Pricing  save(Pricing pricing, Integer policyInstanceHasTblVehicleType) {
//        PolicyInstanceHasTblVehicleType instance = policyInstanceHasVehicleTypeRepository.findById(policyInstanceHasTblVehicleType).get();
//        boolean existed = false;
//        if (instance != null) {
//            List<Pricing> pricingList = pricingRepository.findPricingByPolicyInstanceVehicle(instance.getId());
//            for (Pricing item : pricingList) {
//                if (item.getId() == pricing.getId()) {
//                    existed = true;
//                    item.setFromHour(pricing.getFromHour());
//                    item.setLateFeePerHour(pricing.getLateFeePerHour());
//                    item.setPricePerHour(pricing.getPricePerHour());
//                }
//            }
//            if (!existed) {
//                pricingList.add(pricing);
//                instance.setPricingList(pricingList);
//            }
//            policyInstanceHasVehicleTypeRepository.save(instance);
              pricing.setPolicyInstanceHasTblVehicleTypeId(policyInstanceHasTblVehicleType);
            return pricingRepository.save(pricing);
        }
//        return pricingRepository.save(pricing);


    @Transactional
    public void deletePricing(Integer id) {
        Optional<Pricing> pricing = pricingRepository.findById(id);
        if (pricing.isPresent()) {
            pricingRepository.deletePricingById(pricing.get().getId());
        }

    }


    public void deleteByPolicyHasTblVehicleTypeId(Integer policyHasVehicleTypeId) {
//        pricingRepository.deleteByPolicyHasTblVehicleTypeId(policyHasVehicleTypeId);
    }

    public Pricing findById(Integer pricingId) {
        return pricingRepository.findById(pricingId).get();
    }
}
