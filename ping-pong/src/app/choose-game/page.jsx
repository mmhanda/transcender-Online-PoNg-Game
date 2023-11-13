"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Modal from "react-modal";

const Page = () => {
  const [backgroundColor, setBackgroundColor] = useState("bg-gray-700");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  const openModal = () => setModalIsOpen(true);
  const closeModal = (color) => {
    setModalIsOpen(false);
    setSelectedColor(color);
  };

  const handleLinkClick = () => {
    if (selectedColor) {
      setBackgroundColor(selectedColor);
    }
  };

  return (
    <div
      className={`flex justify-around items-center h-screen ${backgroundColor}`}
    >
      <div
        className="text-center cursor-pointer mx-4 transform transition-transform hover:scale-105"
        onClick={openModal}
      >
        <div onClick={handleLinkClick}>
          <Image
            src="/choose-game-assets/ai.jpg"
            alt="AI"
            width={500}
            height={500}
          />
          <p className="mt-2 text-lg font-bold">Play against AI</p>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          content: {
            backgroundColor: "black",
            borderRadius: "10px",
            padding: "20px",
            maxWidth: "300px",
            margin: "auto",
          },
        }}
      >
        <p>Select a map texture:</p>
        <div className="flex justify-around mt-4">
          <Link href={{ pathname: "/game-bot", query: "color=400" }}>
            <button
              onClick={() => closeModal("bg-amber-900")}
              className="bg-amber-900 w-8 h-8 rounded-full"
            />
          </Link>
          <Link href={{ pathname: "/game-bot", query: "color=300" }}>
            <button
              onClick={() => closeModal("bg-red-500")}
              className="bg-violet-700 w-8 h-8 rounded-full"
            />
          </Link>
          <Link href={{ pathname: "/game-bot", query: "color=100" }}>
            <button
              onClick={() => closeModal("bg-red-500")}
              className="bg-red-500 w-8 h-8 rounded-full"
            />
          </Link>
        </div>
      </Modal>
    </div>
  );
};

export default Page;
