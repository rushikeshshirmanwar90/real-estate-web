"use client";
import Model from "@/components/ui/model";
import React from "react";

const page = () => {
  return (
    <div>
      <Model
        title="Test Title"
        description="Test Description"
        isOpen={true}
        onClose={() => {}}
      >
        This is Test Text
      </Model>
    </div>
  );
};

export default page;