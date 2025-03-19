import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { IconButton, Popover } from "@mui/material";
import { Palette } from "@mui/icons-material";

interface ColorPickerProps {
  setBackgroundColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  setBackgroundColor,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [color, setColor] = useState<string>("#ffffff");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      {/* כפתור לפתיחת בורר הצבעים */}
      <IconButton
        onClick={handleClick}
        style={{
          backgroundColor: color,
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          border: "2px solid #ccc",
        }}
      >
        <Palette style={{ color: "#333" }} />
      </IconButton>

      {/* Popover עם בורר הצבעים */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <SketchPicker
          color={color}
          onChange={(updatedColor) => {
            setColor(updatedColor.hex);
            setBackgroundColor(updatedColor.hex);
          }}
        />
      </Popover>
    </div>
  );
};

export default ColorPicker;
