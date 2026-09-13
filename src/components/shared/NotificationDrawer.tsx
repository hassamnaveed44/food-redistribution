"use client";

import React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Bell, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: any[];
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications = [],
}) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="In-App Notifications" width="sm">
      <div className="flex flex-col gap-4">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-[#6B6157] text-xs">
            <Bell className="w-8 h-8 text-[#6B6157]/40 mx-auto mb-2" />
            No new notifications. You are all caught up!
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border text-xs ${
                n.isRead
                  ? "bg-white border-[#E3DBC9]"
                  : "bg-[#F5F1E8] border-[#B84A16]/40 font-medium"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Bell className="w-3.5 h-3.5 text-[#B84A16]" />
                <span className="font-semibold text-[#211D19]">{n.type}</span>
              </div>
              <p className="text-[#6B6157] leading-relaxed">{n.message}</p>
            </div>
          ))
        )}
      </div>
    </Drawer>
  );
};
