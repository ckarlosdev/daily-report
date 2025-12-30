import { create } from "zustand";
import { DRRental } from "../types";
import { v4 as uuidv4 } from "uuid";
import { persist } from "zustand/middleware";

type RentalsStore = {
  assignedRentals: DRRental[];
  showModalRental: boolean;
  rentalName: string;
  rentalCompanyName: string;
  rentalType: string;
  rentalNumber: string;
  employeesId: number | null;
  odometerModal: number;
  rentalIdSelected: string;
  updateData: boolean;
  setShowModalRental: (show: boolean) => void;
  setRentalName: (name: string) => void;
  setRentalCompanyName: (companyName: string) => void;
  setRentalType: (type: string) => void;
  setRentalNumber: (number: string) => void;
  setEmployeesId: (id: number | null) => void;
  setOdometerModal: (odometer: number) => void;
  setRentalIdSelected: (id: string) => void;
  setUpdateData: (update: boolean) => void;
  addRentals: () => void;
  removeRental: (temporalId: string) => void;
  updateRental: () => void;
  cleanModalData: () => void;
  setFullRentalData: (data: DRRental[]) => void;
  copyRentalsFromApi: (data: DRRental[]) => void;
  reset: () => void;
};

const useRentalsStore = create<RentalsStore>()(
  persist(
    (set) => ({
      assignedRentals: [],
      showModalRental: false,
      rentalName: "",
      rentalCompanyName: "",
      rentalType: "Equipment",
      rentalNumber: "",
      employeesId: 51,
      odometerModal: 0,
      rentalIdSelected: "",
      updateData: false,
      setShowModalRental: (show) => set({ showModalRental: show }),
      setRentalName: (name) => set({ rentalName: name }),
      setRentalCompanyName: (companyName) =>
        set({ rentalCompanyName: companyName }),
      setRentalType: (type) => set({ rentalType: type }),
      setRentalNumber: (number) => set({ rentalNumber: number }),
      setEmployeesId: (id) => set({ employeesId: id }),
      setOdometerModal: (odometer) => set({ odometerModal: odometer }),
      setRentalIdSelected: (id) => set({ rentalIdSelected: id }),
      setUpdateData: (update) => set({ updateData: update }),
      addRentals: () =>
        set((state) => ({
          assignedRentals: [
            ...state.assignedRentals,
            {
              temporalId: uuidv4(),
              drRentalsId: null,
              dailyReportId: null,
              employeesId: state.employeesId,
              equipmentType: state.rentalType,
              equipmentName: state.rentalName,
              company: state.rentalCompanyName,
              equipmentNumber: state.rentalNumber,
              odometer: state.odometerModal,
            },
          ],
        })),
      removeRental: (temporalId) =>
        set((state) => ({
          assignedRentals: state.assignedRentals.filter(
            (rental) => rental.temporalId !== temporalId
          ),
        })),
      updateRental: () =>
        set((state) => {
          const updatedRentals = state.assignedRentals.map((rental) => {
            if (rental.temporalId === state.rentalIdSelected) {
              return {
                ...rental,
                odometer: state.odometerModal,
                employeesId: state.employeesId,
                equipmentType: state.rentalType,
                equipmentName: state.rentalName,
                company: state.rentalCompanyName,
                equipmentNumber: state.rentalNumber,
              };
            }
            return rental;
          });

          return {
            assignedRentals: updatedRentals,
          };
        }),
      cleanModalData: () =>
        set({
          rentalName: "",
          rentalCompanyName: "",
          rentalType: "Equipment",
          rentalNumber: "",
          employeesId: 51,
          odometerModal: 0,
          rentalIdSelected: "",
          updateData: false,
        }),
      setFullRentalData: (data) =>
        set(() => ({
          assignedRentals: data,
        })),
      copyRentalsFromApi: (data) =>
        set((state) => ({
          assignedRentals: [
            ...data.map((rental) => ({
              ...rental,
              drRentalsId: null,
              temporalId: uuidv4(),
            })),
            ...state.assignedRentals,
          ],
        })),
      reset: () =>
        set({
          assignedRentals: [],
          showModalRental: false,
          rentalName: "",
          rentalCompanyName: "",
          rentalType: "Equipment",
          rentalNumber: "",
          employeesId: 51,
          odometerModal: 0,
          rentalIdSelected: "",
          updateData: false,
        }),
    }),
    {
      name: "rentals-storage", // Nombre único en LocalStorage
    }
  )
);

export default useRentalsStore;
