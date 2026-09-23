import { create } from "zustand";
import { DREmployee, Employee } from "../types";
import { ChangeEvent } from "react";
import { persist } from "zustand/middleware";

type AssignmentStore = {
  assignedEmployees: DREmployee[];
  selectedEmployees: Employee[];
  assignedSelected: DREmployee[];
  formData: DREmployee;
  isEditMode: boolean;

  setEditMode: (value: boolean) => void;
  syncSelectedWithAssigned: (employees: Employee[]) => void;
  toggleAssigned: (assign: DREmployee) => void;
  addAssignments: (newAssignments: DREmployee[]) => void;
  updateAssignment: (
    updatedData: Partial<DREmployee>,
    selectedIds: number[],
  ) => void;
  removeEmployee: (employeeId: number) => void;
  addSelection: (employee: Employee) => void;
  resetSelection: () => void;
  updateFormData: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  setFormData: (data: DREmployee) => void;
  cleanFormData: () => void;
  setFullAssignmentData: (data: DREmployee[]) => void;
  copyManpowerFromApi: (data: DREmployee[]) => void;
  reset: () => void;
};

const initialData = {
  drEmployeesId: null,
  dailyReportId: null,
  employeesId: null,
  inHour: "07:00",
  outHour: "17:30",
  lunch: true,
  ppe: true,
  comment: "",
};

const useAssignmentStore = create<AssignmentStore>()(
  persist(
    (set) => ({
      assignedEmployees: [],
      selectedEmployees: [],
      assignedSelected: [],
      isEditMode: false,
      formData: initialData,

      setEditMode: (value) => set({ isEditMode: value }),
      syncSelectedWithAssigned: (employees) =>
        set((state) => {
          const targetIds = state.assignedSelected.map((a) => a.employeesId);

          const filtered = employees.filter((emp) =>
            targetIds.includes(emp.employeesId),
          );

          return {
            selectedEmployees: filtered,
          };
        }),
      toggleAssigned: (assign) =>
        set((state) => {
          const isAlreadyAssigned = state.assignedSelected.some(
            (emp) => emp.employeesId === assign.employeesId,
          );
          return {
            selectedEmployees: [],
            assignedSelected: isAlreadyAssigned
              ? state.assignedSelected.filter(
                  (emp) => emp.employeesId !== assign.employeesId,
                )
              : [...state.assignedSelected, assign],
          };
        }),

      addAssignments: (newAssignments) =>
        set((state) => ({
          assignedEmployees: [...newAssignments, ...state.assignedEmployees],
        })),

      // clearAssignedSelected:

      updateAssignment: (data, selectedIds) =>
        set((state) => ({
          assignedEmployees: state.assignedEmployees.map((assignment) => {
            const isSelected =
              assignment.employeesId &&
              selectedIds.includes(assignment.employeesId);

            return isSelected ? { ...assignment, ...data } : assignment;
          }),
        })),

      removeEmployee: (employeeId) =>
        set((state) => ({
          assignedEmployees: state.assignedEmployees.filter(
            (asigment) => asigment.employeesId !== employeeId,
          ),
        })),

      addSelection: (employee) =>
        set((state) => {
          const isSelected = state.selectedEmployees.some(
            (emp) => emp.employeesId === employee.employeesId,
          );

          return {
            assignedSelected: [],
            selectedEmployees: isSelected
              ? state.selectedEmployees.filter(
                  (emp) => emp.employeesId !== employee.employeesId,
                )
              : [...state.selectedEmployees, employee],
          };
        }),

      resetSelection: () =>
        set({
          selectedEmployees: [],
          assignedSelected: [],
          isEditMode: false,
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
          assignedEmployees: data.map((emp) => ({
            ...emp,
            // Se evalúa a true SOLO si el string es exactamente "true" (o "TRUE")
            lunch: String(emp.lunch).toLowerCase() === "true",
            ppe: String(emp.ppe).toLowerCase() === "true",
          })),
        }),
      copyManpowerFromApi: (data) =>
        set((state) => {
          const existingEmployeeIds = new Set(
            state.assignedEmployees.map((emp) => emp.employeesId),
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
      name: "manpower-storage",
    },
  ),
);

export default useAssignmentStore;
