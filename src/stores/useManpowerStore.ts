import { create } from "zustand";
import { DREmployee, Employee } from "../types";
import { ChangeEvent } from "react";
import { persist } from "zustand/middleware";

type AssignmentStore = {
  assignedEmployees: DREmployee[];
  selectedEmployees: Employee[];
  formData: DREmployee;
  addAssignments: (newAssignments: DREmployee[]) => void;
  updateAssignment: (updatedData: DREmployee) => void;
  removeEmployee: (employeeId: number) => void;
  addSelection: (employee: Employee) => void;
  resetSelection: () => void;
  updateFormData: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setFormData: (data: DREmployee) => void;
  cleanFormData: () => void;
  setFullAssignmentData: (data: DREmployee[]) => void;
  copyManpowerFromApi: (data: DREmployee[]) => void;
  reset: () => void;
};

const useAssignmentStore = create<AssignmentStore>()(
  persist(
    (set) => ({
      assignedEmployees: [],
      selectedEmployees: [],
      formData: {
        drEmployeesId: null,
        dailyReportId: null,
        employeesId: null,
        inHour: "07:00",
        outHour: "17:30",
        lunch: true,
        ppe: true,
        comment: "",
      },

      addAssignments: (newAssignments) =>
        set((state) => ({
          assignedEmployees: [...newAssignments, ...state.assignedEmployees],
        })),

      updateAssignment: (data) =>
        set((state) => ({
          assignedEmployees: state.assignedEmployees.map((assignment) =>
            assignment.employeesId === data.employeesId ? data : assignment
          ),
        })),

      removeEmployee: (employeeId) =>
        set((state) => ({
          assignedEmployees: state.assignedEmployees.filter(
            (asigment) => asigment.employeesId !== employeeId
          ),
        })),

      addSelection: (employee) =>
        set((state) => {
          const isSelected = state.selectedEmployees.some(
            (emp) => emp.employeesId === employee.employeesId
          );

          return {
            selectedEmployees: isSelected
              ? state.selectedEmployees.filter(
                  (emp) => emp.employeesId !== employee.employeesId
                )
              : [...state.selectedEmployees, employee],
          };
        }),

      resetSelection: () =>
        set({
          selectedEmployees: [],
        }),

      updateFormData: (e) =>
        set((state) => {
          const { name, value, type } = e.target;
          let newValue;

          if (type === "checkbox") {
            const checkboxTarget = e.target as HTMLInputElement;
            newValue = checkboxTarget.checked;
          } else {
            newValue = value;
          }

          return {
            ...state,
            formData: {
              ...state.formData,
              [name]: newValue,
            },
          };
        }),

      setFormData: (data) =>
        set({
          formData: data,
        }),

      cleanFormData: () =>
        set({
          formData: {
            drEmployeesId: null,
            dailyReportId: null,
            employeesId: null,
            inHour: "07:00",
            outHour: "17:30",
            lunch: true,
            ppe: true,
            comment: "",
          },
        }),
      setFullAssignmentData: (data) =>
        set({
          assignedEmployees: data,
        }),
      copyManpowerFromApi: (data) =>
        set((state) => {
          const existingEmployeeIds = new Set(
            state.assignedEmployees.map((emp) => emp.employeesId)
          );

          const newEmployees = data
            .filter((emp) => !existingEmployeeIds.has(emp.employeesId))
            .map((emp) => ({
              ...emp,
              inHour: emp.inHour ? emp.inHour.slice(0, 5) : emp.inHour,
              outHour: emp.outHour ? emp.outHour.slice(0, 5) : emp.outHour,
              drEmployeesId: null,
            }));
          return {
            assignedEmployees: [...newEmployees, ...state.assignedEmployees],
          };
        }),
      reset: () => set({ assignedEmployees: [], selectedEmployees: [] }),
    }),
    {
      name: "manpower-storage", // Nombre único en LocalStorage
    }
  )
);

export default useAssignmentStore;
