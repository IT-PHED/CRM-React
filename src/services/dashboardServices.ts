import axiosClient from "./axiosClient";

const categorywiseURL = "dashboard/category-wise-summary";
const datewiseURL = "dashboard/date-wise-summary";
const locationwiseURL = "dashboard/location-wise-summary";
const slacountURL = "dashboard/sla-count-summary";
const sladivcountURL = "dashboard/sla-div-count-summary";
const sladurationURL = "dashboard/sla-duration-summary";
const ticketURL = "dashboard/ticket-summary";

// defaults: first day of current month → today
const now = new Date();
const fromDate = new Date(now.getFullYear(), now.getMonth(), 1)
  .toISOString()
  .split("T")[0];
const toDate = now.toISOString().split("T")[0];
const divId = 1;

const defaultParams = { fromDate, toDate, divId };

export async function getCategoryWise() {
  const { data } = await axiosClient.get(categorywiseURL, {
    params: defaultParams,
  });
  return data;
}

export async function getDateWise() {
  const { data } = await axiosClient.get(datewiseURL, {
    params: defaultParams,
  });
  return data;
}

export async function getLocationWise() {
  const { data } = await axiosClient.get(locationwiseURL, {
    params: defaultParams,
  });
  return data;
}

export async function getSlaCount() {
  const { data } = await axiosClient.get(slacountURL, {
    params: defaultParams,
  });
  return data;
}

export async function getSlaDivCount() {
  const { data } = await axiosClient.get(sladivcountURL, {
    params: defaultParams,
  });
  return data;
}

export async function getSlaDuration() {
  const { data } = await axiosClient.get(sladurationURL, {
    params: defaultParams,
  });
  return data;
}

export async function getTicketSummary() {
  const { data } = await axiosClient.get(ticketURL, {
    params: defaultParams,
  });
  return data;
}
