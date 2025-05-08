import domain from "@/components/utils/domain";
import { HeroSectionProps } from "@/types/HomePage";
import axios from "axios";

export const addHeroSection = async (data: HeroSectionProps[] | undefined) => {
  try {
    const response = await axios.post(`${domain}/api/hero-section`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) {
      console.log("Hero section added successfully:", response.data);
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error adding hero section:", error);
    throw error;
  }
};
