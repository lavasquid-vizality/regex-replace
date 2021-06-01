import React, { memo } from 'react';
import { SwitchItem } from '@vizality/components/settings';
import { CodeBlock } from '@vizality/components';

export default memo(({ getSetting, updateSetting, toggleSetting }) => {
  return (
    <>
      <CodeBlock header={'Usage'} content={'.replace <Search: Regex> <Replace: String>\nRegex format: /pattern/flags, flags are optional\nFor capturing groups use ($1, $2, ect.) in replace\nRegex CAN include spaces in the pattern'} />
      <SwitchItem
        value={getSetting('SuccessMessage', false)}
        onChange={() => toggleSetting('SuccessMessage')}
      >
        {'Show Success Message'}
      </SwitchItem>
    </>
  );
});
