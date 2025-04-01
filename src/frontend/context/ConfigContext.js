import React, { createContext, useState, useContext } from "react";

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    backgroundColor: "#FFFFFF",
    menuColor: "#BDACD",
    eliminarChatColor: "#FA5858",
    subirImagenColor: "#64B297",
    eliminarImagenColor: "#D9D9D9",
    nuevoChatColor: "#B0ADF9",
    colorLateral: "#98cdd5", // Color por defecto del Sidebar
    colorLateralFooter: "#8eccd5", // Footer del Sidebar
    colorBotonIA: "#64B297",
    colorMensChatIA: "#ebf2f4", // Color del bot en ChatPage
    colorMensChatUs: "#83ccd7", // Color del usuario en ChatPage
    mode: "Claro",
    username: "Hugo Pérez",
    profilePic: null, // Para la foto de perfil
  });

  const updateConfig = (newConfig) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);