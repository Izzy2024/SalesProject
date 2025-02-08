import React, { useState } from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { Pencil, Trash2 } from 'lucide-react';

const ProductActions = ({ product, onEdit, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    
    try {
      await onDelete(product.id);
      setShowDeleteDialog(false);
    } catch (err) {
      setError('Error al eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onEdit(product)}
        className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100"
        title="Editar producto"
      >
        <Pencil className="h-5 w-5" />
      </button>
      
      <button
        onClick={() => setShowDeleteDialog(true)}
        className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
        title="Eliminar producto"
      >
        <Trash2 className="h-5 w-5" />
      </button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {loading ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductActions;