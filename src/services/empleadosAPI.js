import axiosClient from "./axiosClient";

export const getEmployees = () =>
    axiosClient.get('empleados').then((r)=> r.data);

export const createEmployee = (dto) =>
    axiosClient.post('empleados', dto).then((r)=>r.data);

export const updateEmployee = (legajo, data) =>
    axiosClient.put(`empleados/${legajo}`).then((r)=> r.data);

export const deleteEmployee = (legajo) =>
    axiosClient.delete(`empleados/${legajo}`);