import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

// biblioteca para formatação de tamanho de arquivo
import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    // como se estivesse dando um submitid em form html (tipo os objetos que são enviados atraves do form)
    // basicamente equivale a um formulário
    const data = new FormData();

    // COMO É APENAS UM ARQUIVO SENDO PASSADO NÃO FAZ SENTIDO PASSAR MAPEANDO COMO UM ARRAY
    const file = uploadedFiles[0];

    data.append('file', file.file, file.name);

    try {
      await api.post('/transactions/import', data);
      history.push('/');
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    const newFile = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));

    setUploadedFiles(newFile);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
