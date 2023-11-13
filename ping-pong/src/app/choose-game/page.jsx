"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useRouter } from "next/navigation";

const Page = () => {
  const [backgroundColor, setBackgroundColor] = useState("bg-gray-700");
  const [aiModalIsOpen, setAiModalIsOpen] = useState(false);
  const [aiSelectedColor, setAiSelectedColor] = useState(null);
  const [aiRedirectPath, setAiRedirectPath] = useState(null);

  const [onlineModalIsOpen, setOnlineModalIsOpen] = useState(false);
  const [onlineSelectedColor, setOnlineSelectedColor] = useState(null);
  const [onlineRedirectPath, setOnlineRedirectPath] = useState(null);

  const [offlineModalIsOpen, setOfflineModalIsOpen] = useState(false);
  const [offlineSelectedColor, setOfflineSelectedColor] = useState(null);
  const [offlineRedirectPath, setOfflineRedirectPath] = useState(null);

  const router = useRouter();

  const openModal = (setModal) => setModal(true);

  const closeModal = (
    color,
    path,
    setModal,
    setSelectedColor,
    setRedirectPath
  ) => {
    setModal(false);
    setSelectedColor(color);
    setRedirectPath(path);
  };

  useEffect(() => {
    const handleRedirect = (selectedColor, redirectPath) => {
      if (selectedColor && redirectPath) {
        router.push(`${redirectPath}?color=${selectedColor}`, undefined, {
          shallow: true,
        });
      }
    };

    handleRedirect(aiSelectedColor, aiRedirectPath);
    handleRedirect(onlineSelectedColor, onlineRedirectPath);
    handleRedirect(offlineSelectedColor, offlineRedirectPath);
  }, [
    aiSelectedColor,
    aiRedirectPath,
    onlineSelectedColor,
    onlineRedirectPath,
    offlineSelectedColor,
    offlineRedirectPath,
  ]);

  return (
    <div
      className={`flex justify-around items-center h-screen ${backgroundColor}`}
    >
      <div
        className="text-center cursor-pointer mx-4 transform transition-transform hover:scale-105"
        onClick={() => openModal(setAiModalIsOpen)}
      >
        <div>
          <Image
            src="/choose-game-assets/ai.jpg"
            alt="AI"
            width={500}
            height={500}
          />
          <Modal
            isOpen={aiModalIsOpen}
            onRequestClose={() => setAiModalIsOpen(false)}
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
              <button
                onClick={() =>
                  closeModal(
                    "400",
                    "game-bot",
                    setAiModalIsOpen,
                    setAiSelectedColor,
                    setAiRedirectPath
                  )
                }
                className="bg-amber-900 w-8 h-8 rounded-full"
              />
              <button
                onClick={() =>
                  closeModal(
                    "300",
                    "game-bot",
                    setAiModalIsOpen,
                    setAiSelectedColor,
                    setAiRedirectPath
                  )
                }
                className="bg-violet-700 w-8 h-8 rounded-full"
              />
              <button
                onClick={() =>
                  closeModal(
                    "100",
                    "game-bot",
                    setAiModalIsOpen,
                    setAiSelectedColor,
                    setAiRedirectPath
                  )
                }
                className="bg-green-700 w-8 h-8 rounded-full"
              />
            </div>
          </Modal>
          <p className="mt-2 text-lg font-bold">Play against AI</p>
        </div>
      </div>

      <div
        className="text-center cursor-pointer mx-4 transform transition-transform hover:scale-105"
        onClick={() => openModal(setOnlineModalIsOpen)}
      >
        <div>
          <Image
            src="/choose-game-assets/online.jpg"
            alt="Online"
            width={500}
            height={500}
          />
          <Modal
            isOpen={onlineModalIsOpen}
            onRequestClose={() => setOnlineModalIsOpen(false)}
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
              <button
                onClick={() =>
                  closeModal(
                    "400",
                    "game",
                    setOnlineModalIsOpen,
                    setOnlineSelectedColor,
                    setOnlineRedirectPath
                  )
                }
                className="bg-amber-900 w-8 h-8 rounded-full"
              />
              <button
                onClick={() =>
                  closeModal(
                    "300",
                    "game",
                    setOnlineModalIsOpen,
                    setOnlineSelectedColor,
                    setOnlineRedirectPath
                  )
                }
                className="bg-violet-700 w-8 h-8 rounded-full"
              />
              <button
                onClick={() =>
                  closeModal(
                    "100",
                    "game",
                    setOnlineModalIsOpen,
                    setOnlineSelectedColor,
                    setOnlineRedirectPath
                  )
                }
                className="bg-green-700 w-8 h-8 rounded-full"
              />
            </div>
          </Modal>
          <p className="mt-2 text-lg font-bold">Play online</p>
        </div>
      </div>

      <div
        className="text-center cursor-pointer mx-4 transform transition-transform hover:scale-105"
        onClick={() => openModal(setOfflineModalIsOpen)}
      >
        <div>
          <Link href="/game-local">
            <Image
              src="/choose-game-assets/offline.jpg"
              alt="Offline"
              width={500}
              height={500}
            />
            <p className="mt-2 text-lg font-bold">Play locally</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
