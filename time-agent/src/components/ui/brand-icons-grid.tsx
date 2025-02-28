"use client";

import React, { useState } from "react";
import * as SimpleIcons from "simple-icons";
import { BrandIcon } from "./brand-icon";
import { Input } from "./input";

export function BrandIconsGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get all icon keys from SimpleIcons
  const allIconKeys = Object.keys(SimpleIcons).filter(key => key.startsWith("si"));
  
  // Filter icons based on search term
  const filteredIcons = searchTerm
    ? allIconKeys.filter(key => 
        key.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allIconKeys;
  
  // Convert icon keys to brand names (e.g., "siGithub" -> "GitHub")
  const getBrandName = (iconKey: string) => {
    // Remove "si" prefix and format the name
    const name = iconKey.slice(2);
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search icons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <p className="text-sm text-muted-foreground mt-2">
          {filteredIcons.length} icons found
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredIcons.map((iconKey) => {
          const brandName = getBrandName(iconKey);
          return (
            <div 
              key={iconKey} 
              className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-muted/50 transition-colors"
            >
              <BrandIcon brand={brandName} size={32} className="mb-2" />
              <span className="text-xs text-center truncate w-full">{brandName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 