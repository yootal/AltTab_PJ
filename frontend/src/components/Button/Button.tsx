import classNames from 'classnames';
import styles from './Button.module.scss';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color: 'green' | 'black';
  fill: boolean;
  size: 'large' | 'small';
};

export function Button({ color, fill, size, ...rest }: ButtonProps) {
  const { type = 'button', disabled = false, children } = rest;
  const buttonClass = classNames(styles.button, {
    [styles.green]: color === 'green',
    [styles.black]: color === 'black',
    [styles.empty]: !fill,
    [styles.large]: size === 'large',
    [styles.small]: size === 'small',
  });

  return (
    <>
      <button type={type} disabled={disabled} {...rest} className={buttonClass}>
        {children}
      </button>
    </>
  );
}