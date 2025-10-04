"use client";
import React from "react";
import { cn } from "@workspace/ui/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);
  let colors = [
    "#93c5fd",
    "#f9a8d4",
    "#86efac",
    "#fde047",
    "#fca5a5",
    "#d8b4fe",
    "#93c5fd",
    "#a5b4fc",
    "#c4b5fd",
  ];
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Function to determine if a box should be part of the N shape
  const isNShape = (row: number, col: number) => {
    // Define the N shape pattern - make it more visible
    const centerRow = Math.floor(rows.length / 2);
    const centerCol = Math.floor(cols.length / 2);
    
    // Vertical line on the left (first column of N)
    if (col === centerCol - 3 && row >= centerRow - 10 && row <= centerRow + 10) {
      return true;
    }
    
    // Vertical line on the right (last column of N)
    if (col === centerCol + 3 && row >= centerRow - 10 && row <= centerRow + 10) {
      return true;
    }
    
    // Diagonal line (connecting the two vertical lines)
    const diagonalOffset = row - centerRow;
    const diagonalCol = centerCol - 3 + Math.floor(diagonalOffset * 0.6);
    if (col === diagonalCol && 
        row >= centerRow - 10 && row <= centerRow + 10 &&
        Math.abs(diagonalOffset) <= 10) {
      return true;
    }
    
    return false;
  };

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
        className,
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <div
          key={`row` + i}
          className="relative h-8 w-16 border-l border-black"
        >
          {cols.map((_, j) => (
            <div
              key={`col` + j}
              className="relative h-8 w-16 border-t border-r border-black hover:bg-opacity-30 transition-colors duration-0"
              style={{
                backgroundColor: isNShape(i, j) ? 'rgba(0, 0, 0, 0.1)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!isNShape(i, j)) {
                  e.currentTarget.style.backgroundColor = getRandomColor() || '#93c5fd';
                }
              }}
              onMouseLeave={(e) => {
                if (!isNShape(i, j)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
