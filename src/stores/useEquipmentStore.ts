import { create } from "zustand";
import { Attachment, DREquipment, Equipment } from "../types";
import { persist } from "zustand/middleware";

type EquipmentStore = {
  assignedEquipments: DREquipment[];
  equipmentSelected: Equipment;
  attachmentsSelected: Attachment;
  showModalEquipment: boolean;
  showModalOdometer: boolean;
  hourModal: number;
  operadorId: number;
  updateAssigned: boolean;
  equipmentsListCopied: DREquipment[];
  setHourModal: (hour: number) => void;
  setOperatorId: (operatorNumber: number) => void;
  setUpdateAssigned: (update: boolean) => void;
  setShowModalEquipment: (show: boolean) => void;
  setShowModalOdometer: (show: boolean) => void;
  setEquipmentSelected: (equipment: Equipment) => void;
  setAttachmentSelected: (attachment: Attachment) => void;
  addEquipment: () => void;
  removeEquipment: (equipmentId: number) => void;
  updateEquipment: () => void;
  addAttachement: () => void;
  setFullEquipmentData: (data: DREquipment[]) => void;
  copyEquipmentFromApi: (data: DREquipment[]) => void;
  assignHoursToEquipment: (equipmentId: number, hours: string) => void;
  assignOperatorToEquipment: (equipmentId: number, operatorId: number) => void;
  resetEquipmentCopied: () => void;
  reset: () => void;
};

const useEquipmentStore = create<EquipmentStore>()(
  persist(
    (set) => ({
      assignedEquipments: [],
      equipmentSelected: {} as Equipment,
      attachmentsSelected: {} as Attachment,
      showModalEquipment: false,
      showModalRental: false,
      showModalOdometer: true,
      hourModal: 0,
      operadorId: 51,
      updateAssigned: false,
      rentalEquipment: false,
      rentalName: "",
      rentalType: "Equipment",
      rentalNumber: 0,
      equipmentsListCopied: [],
      setHourModal: (hour) => set({ hourModal: hour }),
      setOperatorId: (operadorId) => set({ operadorId: operadorId }),
      setUpdateAssigned: (update) => set({ updateAssigned: update }),
      setShowModalEquipment: (show) => set({ showModalEquipment: show }),
      setShowModalOdometer: (show) => set({ showModalOdometer: show }),
      setEquipmentSelected: (equipment) =>
        set({ equipmentSelected: equipment }),
      setAttachmentSelected: (attachment) =>
        set({ attachmentsSelected: attachment }),
      addEquipment: () =>
        set((state) => ({
          assignedEquipments: [
            ...state.assignedEquipments,
            {
              drEquipmentsId: null,
              dailyReportId: null,
              equipmentsId: state.equipmentSelected.equipmentsId,
              employeesId: state.operadorId,
              type: "Equipment",
              name: state.equipmentSelected.name,
              initialHour: state.equipmentSelected.hour,
              newHour: String(state.hourModal),
            },
          ],
        })),
      removeEquipment: (equipmentId) =>
        set((state) => ({
          assignedEquipments: state.assignedEquipments.filter(
            (equip) => equip.equipmentsId !== equipmentId
          ),
        })),
      updateEquipment: () =>
        set((state) => ({
          assignedEquipments: state.assignedEquipments.map((equip) =>
            equip.equipmentsId === state.equipmentSelected.equipmentsId
              ? {
                  ...equip,
                  employeesId: state.operadorId,
                  newHour: String(state.hourModal),
                }
              : equip
          ),
        })),
      addAttachement: () =>
        set((state) => ({
          assignedEquipments: [
            ...state.assignedEquipments,
            {
              drEquipmentsId: null,
              dailyReportId: null,
              equipmentsId: state.attachmentsSelected.attachmentsId,
              employeesId: null,
              type: "Attachment",
              name: state.attachmentsSelected.name,
              initialHour: "N/A",
              newHour: "N/A",
            },
          ],
        })),
      setFullEquipmentData: (data) =>
        set(() => ({
          assignedEquipments: data,
        })),
      copyEquipmentFromApi: (data) =>
        set((state) => {
          const existingIds = new Set(
            state.assignedEquipments.map(
              (equipment) => `${equipment.equipmentsId}-${equipment.type}`
            )
          );
          const newEquipments = data
            .filter((equipment) => {
              const uniqueId = `${equipment.equipmentsId}-${equipment.type}`;
              return !existingIds.has(uniqueId);
            })
            .map((equipment) => ({
              ...equipment,
              drEquipmentsId: null,
            }));

          const formattedForCopiedList = newEquipments.map((eq) => ({
            ...eq,
            initialHour: eq.newHour,
          }));
          return {
            assignedEquipments: [...formattedForCopiedList, ...state.assignedEquipments],
            equipmentsListCopied: [
              ...newEquipments,
              ...(state.equipmentsListCopied || []),
            ],
          };
        }),
      assignHoursToEquipment: (equipmentId, hours) =>
        set((state) => ({
          assignedEquipments: state.assignedEquipments.map((equipment) =>
            equipment.equipmentsId === equipmentId
              ? { ...equipment, newHour: hours }
              : equipment
          ),
          equipmentsListCopied: state.equipmentsListCopied.map((equipment) =>
            equipment.equipmentsId === equipmentId
              ? { ...equipment, newHour: hours }
              : equipment
          ),
        })),
      assignOperatorToEquipment: (equipmentId, operatorId) =>
        set((state) => ({
          assignedEquipments: state.assignedEquipments.map((equipment) =>
            equipment.equipmentsId === equipmentId
              ? { ...equipment, employeesId: operatorId }
              : equipment
          ),
          equipmentsListCopied: state.equipmentsListCopied.map((equipment) =>
            equipment.equipmentsId === equipmentId
              ? { ...equipment, employeesId: operatorId }
              : equipment
          ),
        })),
      resetEquipmentCopied: () =>
        set(() => ({
          equipmentsListCopied: [],
        })),
      reset: () =>
        set({
          assignedEquipments: [],
          equipmentsListCopied: [],
          equipmentSelected: {} as Equipment,
          attachmentsSelected: {} as Attachment,
          showModalEquipment: false,
          hourModal: 0,
          operadorId: 51,
          updateAssigned: false,
        }),
    }),
    {
      name: "equipments-storage",
    }
  )
);

export default useEquipmentStore;
