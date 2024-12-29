import { ProjectProps } from "./project-props"
import { BuildingProps } from "./building-props"

export interface BuildingSectionProps {
    project: ProjectProps, buildings: BuildingProps, onAddBuilding: (item: any) => void, onDeleteBuilding: () => void
}