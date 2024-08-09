import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { CanvasSection } from '@/pages/Canvas/CanvasSection';
import { Button } from '@/components/Button/Button';
import { Modal } from '@/components/Modal/Modal';
import { useCompilerModalState } from '@/hooks/useCompilerState';
import { MODAL } from '@/constants/modal';
import { highlightCode } from '@/utils/highlightCode';
import { useGetCodeQuery } from '@/queries/executor';

import styles from './Compiler.module.scss';
import { LineNumber } from './LineNumber';
import { CompilerSidebar } from './CompilerSidebar';

export function Compiler() {
  const { studyId, problemId } = useParams();
  const [codeText, setCodeText] = useState('');
  const [highlightedCode, setHighlightedCode] = useState('');
  const [canvasIsOpen, setCanvasIsOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const codeAreaRef = useRef<HTMLDivElement | null>(null);
  const { isModalOpen, setIsModalOpen, setModal, setIsFill } =
    useCompilerModalState();
  // TODO : 스터디원 정보 받아오도록 수정
  const [members] = useState([
    '신승호',
    '유경헌',
    '이재영',
    '이지원',
    '이치왕',
    '지종권',
  ]);
  const [selected, setSelected] = useState(0);
  const { data, refetch } = useGetCodeQuery(
    studyId!,
    problemId!,
    selected.toString(),
  );

  const resizeCodeArea = () => {
    textareaRef.current!.style.width = '100%';
    textareaRef.current!.style.height = '100%';
    codeAreaRef.current!.style.height = '100%';
    textareaRef.current!.style.width = `${textareaRef.current!.scrollWidth}px`;
    textareaRef.current!.style.height = `${textareaRef.current!.scrollHeight}px`;
    codeAreaRef.current!.style.height = `${codeAreaRef.current!.scrollHeight}px`;
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCodeText = event.target.value;
    setCodeText(newCodeText);
    resizeCodeArea();
  };

  useEffect(() => {
    if (data && data.code) {
      setCodeText(data.code);
    }
  }, [data]);

  useEffect(() => {
    setHighlightedCode(highlightCode(codeText, 'java'));
    resizeCodeArea();
  }, [codeText]);

  useEffect(() => {
    (async () => {
      const { data } = await refetch();
      if (data) {
        setCodeText(data.code);
      } else {
        setCodeText('');
      }
    })();
  }, [selected]);

  useEffect(() => {
    window.addEventListener('resize', resizeCodeArea);
    return () => {
      window.removeEventListener('resize', resizeCodeArea);
    };
  }, []);

  const openCanvas = () => {
    setCanvasIsOpen(true);
  };

  const closeCanvas = () => {
    setCanvasIsOpen(false);
  };

  const openRunCodeModal = () => {
    setModal(MODAL.RUN);
    setIsFill(false);
    setIsModalOpen(true);
  };

  const handleTabClick = async (selectedTab: number) => {
    setSelected(selectedTab);
    // const { data } = await refetch();
    // if (data) {
    //   setCodeText(data.code);
    // } else {
    //   setCodeText('');
    // }
  };

  return (
    <div className={styles.container}>
      {isModalOpen && <Modal code={codeText} selected={selected} />}
      <div className={styles.compilerContainer}>
        <CompilerSidebar />
        <div className={styles.tabContainer}>
          {members.map((member, index) => (
            <div
              key={index}
              className={`${styles.tab} ${index === selected ? styles.selected : ''}`}
              onClick={() => handleTabClick(index)}
            >
              {member}
            </div>
          ))}
        </div>
        <div className={styles.compilerTitle}>
          <div>Code Snippet</div>
          <div>Java</div>
        </div>
        <div className={styles.compiler}>
          <div className={styles.compilerBody} ref={codeAreaRef}>
            <LineNumber codeText={codeText} />
            <div className={styles.codeContainer}>
              <textarea
                className={styles.textArea}
                onChange={handleChange}
                value={codeText}
                ref={textareaRef}
              ></textarea>
              <pre className={styles.codeArea}>
                <code
                  className={styles.code}
                  dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
              </pre>
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            color="green"
            fill={true}
            size="large"
            onClick={openRunCodeModal}
          >
            Run Code
          </Button>
          <Button color="green" fill={true} size="large" onClick={openCanvas}>
            Draw
          </Button>
        </div>
      </div>
      {canvasIsOpen && <CanvasSection closeCanvas={closeCanvas} />}
    </div>
  );
}
