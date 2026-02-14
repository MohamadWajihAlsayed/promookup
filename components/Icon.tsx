import React from 'react';
import { Star, Upload, Download, Package, RotateCcw, Image as ImageIcon, Plus, Trash2, Layout, Check } from 'lucide-react';

export const StarIcon = ({ className }: { className?: string }) => <Star className={className} fill="currentColor" />;
export const UploadIcon = ({ className }: { className?: string }) => <Upload className={className} />;
export const DownloadIcon = ({ className }: { className?: string }) => <Download className={className} />;
export const PackageIcon = ({ className }: { className?: string }) => <Package className={className} />;
export const ResetIcon = ({ className }: { className?: string }) => <RotateCcw className={className} />;
export const ImageIconIcon = ({ className }: { className?: string }) => <ImageIcon className={className} />;
export const PlusIcon = ({ className }: { className?: string }) => <Plus className={className} />;
export const TrashIcon = ({ className }: { className?: string }) => <Trash2 className={className} />;
export const LayoutIcon = ({ className }: { className?: string }) => <Layout className={className} />;
export const CheckIcon = ({ className }: { className?: string }) => <Check className={className} />;