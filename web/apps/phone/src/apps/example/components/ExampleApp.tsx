import React from 'react';
import { useExampleStringValue } from '../hooks/state';
import { useApp } from '@os/apps/hooks/useApps';
import { useTranslation } from 'react-i18next';

export const ExampleApp: React.FC = () => {
  const exampleString = useExampleStringValue();
  const example = useApp('EXAMPLE');
  const [t] = useTranslation();

  return (
    <div className="flex flex-col gap-4 mt-2 px-4">
      {/* Bloco de Mensagem Principal */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[10px] overflow-hidden px-4 py-3 flex flex-col gap-2">
        <h3 className="text-[17px] font-semibold text-neutral-900 dark:text-white">Bem-vindo ao NPWD!</h3>
        <p className="text-[15px] text-neutral-500 leading-tight">
          Este é o modelo padrão com o novo cabeçalho dinâmico e background de tema estilo iOS. Use estes painéis arredondados para estruturar suas informações.
        </p>

        <button className="mt-2 w-full px-4 py-2.5 bg-[#007AFF] active:bg-[#005bb5] text-white font-medium rounded-[8px] transition-colors">
          App ID: {example.id}
        </button>
      </div>

      {/* Bloco de Informação Secundária */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[10px] px-4 py-3">
        <span className="text-[13px] font-medium text-neutral-500 uppercase tracking-wider mb-1 block">Variável de Estado</span>
        <h3 className="text-[17px] font-normal text-neutral-900 dark:text-white">{exampleString}</h3>
      </div>
    </div>
  );
};
