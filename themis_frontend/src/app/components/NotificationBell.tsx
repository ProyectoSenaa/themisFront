'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HiCheck, HiOutlineClipboardList, HiOutlineUserGroup, HiBell } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { gql, useSubscription } from '@apollo/client';
import { apolloClient } from '@/lib/apolloClient';


type NotificationType = 'NOVELTY' | 'COMMITTEE';

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    targetUser: string;
    time: string;
    read: boolean;
}


// inicialmente vacío; se llenará con la suscripción
const STATIC_NOTIFICATIONS: Notification[] = [];

// Suscripción GraphQL (ajustar campos según el DTO server-side)
const NOTIFICATION_CREATED_SUBSCRIPTION = gql`
    subscription NotificationCreated($recipientId: Long) {
        notificationCreated(recipientId: $recipientId) {
            id
            notiMessage
            notiStatus
            registrationDate
            noveltyId
            recipientId
        }
    }
`;

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(STATIC_NOTIFICATIONS);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);
    const [recipientIdFilter, setRecipientIdFilter] = useState<number | null>(null);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    // useSubscription - solo en cliente
    const { data: subData, error: subError } = useSubscription(NOTIFICATION_CREATED_SUBSCRIPTION, {
        variables: recipientIdFilter ? { recipientId: recipientIdFilter } : {},
        client: apolloClient,
        shouldResubscribe: false,
        onSubscriptionData: ({ subscriptionData }) => {
            // handler en caso de que useSubscription no actualice automáticamente
            const payload = subscriptionData.data?.notificationCreated;
            if (payload) handleIncomingNotification(payload);
        }
    });

    useEffect(() => {
        if (subError) console.error('Subscription error:', subError);
    }, [subError]);

    const handleIncomingNotification = (payload: any) => {
        try {
            const mapped: Notification = {
                id: String(payload.id),
                type: payload.noveltyId ? 'NOVELTY' : 'COMMITTEE',
                title: payload.notiMessage || 'Notificación',
                description: payload.notiMessage || '',
                targetUser: `Usuario ${payload.recipientId ?? ''}`,
                time: payload.registrationDate ? new Date(payload.registrationDate).toLocaleString() : 'Ahora',
                read: false,
            };

            setNotifications(prev => [mapped, ...prev].slice(0, 50));
        } catch (e) {
            console.error('Error mapeando notificación entrante', e);
        }
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const handleNotificationClick = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Botón de la campanita */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-full transition-all duration-300 ${isOpen
                        ? (darkMode ? 'bg-gray-700 text-white' : 'bg-lime-100 text-lime-600')
                        : (darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-white hover:bg-white/20')
                    }`}
                aria-label="Notificaciones"
            >
                <HiBell className={`h-6 w-6 ${unreadCount > 0 ? 'animate-pulse' : ''}`} />

                {/* Badge de contador */}
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm border-2 border-transparent">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className={`absolute right-0 mt-3 w-80 sm:w-96 origin-top-right rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden transition-all duration-200 ease-out ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
                    }`}>
                    {/* Header */}
                    <div className={`px-4 py-3 flex items-center justify-between border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'
                        }`}>
                        <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Notificaciones
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className={`text-xs font-medium transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-lime-600 hover:text-lime-700'
                                    }`}
                            >
                                Marcar leídas
                            </button>
                        )}
                    </div>

                    {/* Lista de notificaciones */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification.id)}
                                        className={`group px-4 py-3 flex items-start space-x-3 cursor-pointer transition-colors ${notification.read
                                                ? (darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50')
                                                : (darkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-lime-50/50 hover:bg-lime-50')
                                            }`}
                                    >
                                        {/* Icono según tipo */}
                                        <div className={`flex-shrink-0 mt-1 h-8 w-8 rounded-full flex items-center justify-center ${notification.type === 'NOVELTY'
                                                ? (darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600')
                                                : (darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600')
                                            }`}>
                                            {notification.type === 'NOVELTY' ? (
                                                <HiOutlineClipboardList className="h-4 w-4" />
                                            ) : (
                                                <HiOutlineUserGroup className="h-4 w-4" />
                                            )}
                                        </div>

                                        {/* Contenido */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <p className={`text-sm font-medium truncate ${notification.read
                                                        ? (darkMode ? 'text-gray-300' : 'text-gray-700')
                                                        : (darkMode ? 'text-white' : 'text-gray-900')
                                                    }`}>
                                                    {notification.title}
                                                </p>
                                                <span className={`text-xs whitespace-nowrap ${darkMode ? 'text-gray-500' : 'text-gray-400'
                                                    }`}>
                                                    {notification.time}
                                                </span>
                                            </div>

                                            <p className={`text-xs mb-1.5 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                {notification.description}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    Para: {notification.targetUser}
                                                </span>

                                                {!notification.read && (
                                                    <span className={`h-2 w-2 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-lime-500'
                                                        }`}></span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 py-8 text-center">
                                <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3 ${darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    <HiBell className="h-6 w-6" />
                                </div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    No tienes notificaciones
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className={`px-4 py-2 border-t text-center ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'
                        }`}>
                        <button className={`text-xs font-medium hover:underline ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
                            }`}>
                            Ver todas las notificaciones
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
