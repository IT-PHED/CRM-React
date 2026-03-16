/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "./axiosClient";

const employeeURL = "employees";

export async function getEmployees() {
  const { data } = await axiosClient.get(employeeURL);
  return data;
}

export async function updateEmployee(id: string, payload: Record<string, any>) {
  const { data } = await axiosClient.put(`${employeeURL}/${id}`, payload);
  return data;
}
