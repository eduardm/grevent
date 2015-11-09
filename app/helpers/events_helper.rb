module EventsHelper

  def selectable_status
    {
        I18n.translate(:go_now) => 1,
        I18n.translate(:go_later) => 0

    }
  end

  def format_time(date)
    return t("never") unless date
    distance_of_time_in_words(date, Time.now) + " ago"
  end

end
