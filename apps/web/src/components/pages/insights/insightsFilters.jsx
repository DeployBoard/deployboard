import { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import CustomFilter from "../../structure/customFilter";
import CustomSnackbar from "../../structure/customSnackbar";
import { getToken } from "../../utils/auth";

const InsightsFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");
  const [environments, setEnvironments] = useState([]);
  const [environmentsLoading, setEnvironmentsLoading] = useState(true);
  const [environmentsError, setEnvironmentsError] = useState("");

  const getServices = async () => {
    setServicesLoading(true);
    try {
      const services = await axios.get(
        `${import.meta.env.VITE_API_URI}/services`,
        {
          headers: {
            authorization: `Bearer ${getToken()}`,
          },
          timeout: 10000,
        }
      );
      // console.log("services", services.data);
      // init our servicesArray
      let servicesArray = [];
      // for each service, push it to our servicesArray
      services.data.forEach((service) => {
        servicesArray.push(service.service);
      });
      // console.log("servicesArray", servicesArray);
      setServices(servicesArray);
      setServicesLoading(false);
    } catch (err) {
      console.log(err);
      setServicesError(err.message);
      setServicesLoading(false);
    }
  };

  const getEnvironments = async () => {
    setEnvironmentsLoading(true);
    try {
      const environments = await axios.get(
        `${import.meta.env.VITE_API_URI}/environments`,
        {
          headers: {
            authorization: `Bearer ${getToken()}`,
          },
          timeout: 10000,
        }
      );
      // console.log("environments", environments.data);
      setEnvironments(environments.data);
      setEnvironmentsLoading(false);
    } catch (err) {
      console.log(err);
      setEnvironmentsError(err.message);
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    getServices();
    getEnvironments();
  }, []);

  return (
    <>
      {servicesError ? (
        <CustomSnackbar severity={"error"} message={servicesError} />
      ) : null}
      {environmentsError ? (
        <CustomSnackbar severity={"error"} message={environmentsError} />
      ) : null}
      <Box sx={{ width: 200 }}>
        <CustomFilter
          label="Service"
          options={services}
          selected={searchParams.get("service")}
          loading={servicesLoading}
          onSelect={(value) => {
            if (value) {
              searchParams.set("service", value);
            } else {
              searchParams.delete("service");
            }
            setSearchParams(searchParams);
          }}
        />
      </Box>
      <Box sx={{ width: 200 }}>
        <CustomFilter
          label="Environment"
          options={environments}
          selected={searchParams.get("environment")}
          loading={environmentsLoading}
          onSelect={(value) => {
            if (value) {
              searchParams.set("environment", value);
            } else {
              searchParams.delete("environment");
            }
            setSearchParams(searchParams);
          }}
        />
      </Box>
    </>
  );
};

export default InsightsFilters;
