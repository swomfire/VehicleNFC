package com.example.demo.repository;

import com.example.demo.entities.Policy;
import com.example.demo.entities.PolicyHasTblVehicleType;
import com.example.demo.entities.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PolicyHasVehicleTypeRepository extends JpaRepository<PolicyHasTblVehicleType, Integer> {
    List<PolicyHasTblVehicleType> findByPolicyId(Policy policy);

    Optional<PolicyHasTblVehicleType> findByPolicyIdAndVehicleTypeId(Policy policy, VehicleType vehicleType);

    List<PolicyHasTblVehicleType> findByPolicyIdIn(List<Policy> policyList);

}